"use strict"

// Padding for diagrams
const SCALESPACE = { x: 40, y: 30, top: 10, right: 20 }

// url to backend server
const API_URL = ""


class TemporalWindow {

    constructor(div, timeData) {
        // div must be the container node which we will fill
        // with the graph.
        // timeData must be a list of objects, each having 
        // a "value" and a "time" attribute
        this.div = div
        this.data = timeData
    }

    initiateSVGandGroups() {
        // get sizes
        this.boundingRect = this.div.getBoundingClientRect()
        this.height = this.boundingRect.height
        this.width = this.boundingRect.width

        // create svg container and set it to be the right size
        this.svg = d3.select(this.div).append("svg")
            .attr("width", this.width).attr("height", this.height)

        this.graph = this.svg.append("g")
        this.xAxis = this.svg.append("g")
        this.yAxis = this.svg.append("g")
    }

    createScales() {
        // get all needed ranges 
        let values = this.data.map((d) => { return +d.value })
        let times = this.data.map((d) => { return +d.time })
        let domainValues = [d3.min(values), d3.max(values)]
        let domainTimes = [d3.min(times), d3.max(times)]

        // creating scales
        this.yScale = d3.scaleLinear().domain(domainValues)
            .range([this.height - SCALESPACE.y, SCALESPACE.top])

        this.xScale = d3.scaleTime().domain(domainTimes)
            .range([SCALESPACE.x, this.width - SCALESPACE.right])

    }

    addGraph() {
        // setting up the line constructor
        let lineGen = d3.line().x((d) => { return this.xScale(d.time) })
            .y((d) => { return this.yScale(d.value) })
            .curve(d3.curveStep)

        // adding graph to window and giving it class "graph" for styling
        this.graph.append("path").attr("d", lineGen(this.data)).attr("class", "graph")
    }

    addAxis() {
        let xAxisGen = d3.axisBottom(this.xScale).ticks(5)
        let yAxisGen = d3.axisLeft(this.yScale).ticks(5)

        this.xAxis.call(xAxisGen)
            .attr("transform", "translate(0, " + (this.height - SCALESPACE.y) + ")")
        this.yAxis.call(yAxisGen).attr("transform", "translate(" + SCALESPACE.x + ", 0)")
    }

    create() {
        this.initiateSVGandGroups()
        this.createScales()
        this.addGraph()
        this.addAxis()
    }

    update() {
        // remove old window
        this.svg.remove()

        // draw graph
        this.create()
    }

    upgrade(data) {
        this.data = data
        // remove old window
        this.svg.remove()
        // draw graph
        this.create()
    }

    enableAutoResize() {
        // bind this
        this.update = this.update.bind(this)

        window.addEventListener("resize", _.debounce(this.update, 100))

    }
}


async function getData() {
    // this function fetches data from the api
    let response = await fetch(API_URL);
    let raw_json = await response.json();
    let data = JSON.parse(raw_json)

    // create upvote data
    let upvoteData = data.map((d) => {
        return {
            value: d.upvote,
            time: new Date(d.time * 1000) 
        }
    })

    // create the comment data
    let commentData = data.map((d) => {
        return {
            value: d.num_comments,
            time: new Date(d.time * 1000) 
        }
    })

    return {upvotes: upvoteData, comments: commentData}
}

async function app(ms) {
    let data = getData()

    // assign each diagram to a premade div
    let dia2 =  new TemporalWindow(document.querySelector(".diagram1"), data.upvotes)
    let dia1 =  new TemporalWindow(document.querySelector(".diagram2"), data.comments)

    // create diagrams and add resize handlers
    dia1.create()
    dia1.enableAutoResize()

    dia2.create()
    dia2.enableAutoResize()

    // function that periodically fetches new data and updates the graphs
    async function appUpdate() {
        setInterval(async function() {
            let newData = await getData()

            dia1.upgrade(newData.comments)
            dia2.upgrade(newData.upvotes)
        },ms)
    }

    appUpdate()
    

}

// run app with 5s update intervals
app(5000)
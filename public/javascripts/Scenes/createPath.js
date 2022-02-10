import CreateScene from "./createScene.js";

class CreatePath extends CreateScene{
	constructor() {
		super('CreatePath', 0xFFFFFF)
		this.tileType = 'road'
		this.oneWay = false
	}

	create() {
		CreateScene.prototype.create.call(this)
		this.graph = this.scene.get('City').graph
		this.nodes = this.graph.getNodes()
	}

	update() {
		if (this.clicked) {
			if (this.nodes.includes(`${this.drag.start.id}`) && this.nodes.includes(`${this.drag.over.id}`)) {
			this.selection = [this.drag.start, this.drag.over]
			} else {
				this.selection = []
			}
		}
	}

	createSelectionObject() {
		this.graph.createPath(this.selection[0], this.selection[1])
	}
}

export default CreatePath
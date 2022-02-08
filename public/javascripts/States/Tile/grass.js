
class GrassState {
	static transitions = [
		{
			to: 'road',
			action: function()	{}
		}
	]
	constructor(tile)	{
		this.name = 'grass'
		this.tile = tile
	}

	onEnter()	{
		this.tile.color = 0x9FDF61
	}

	onExit()	{}

	onUpdate()	{}
}
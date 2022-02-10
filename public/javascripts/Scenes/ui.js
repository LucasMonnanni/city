class UI extends Phaser.Scene {
	constructor() {
		super({
			key: 'UI',
			active: true,
			visible: true
		})
	}
	create() {
		this.text = this.add.text(100, 50, '0')
		this.links = [
			{
				text: 'Create road',
				onClick: () => {
					this.scene.run('CreateRoad')
				}
			},
			{
				text: 'Create road grid',
				onClick: () => {
					this.scene.run('CreateRoadGrid')
				}
			},
			{
				text: 'Create zone',
				onClick: () => {
					this.scene.run('CreateZone')
				}
			},
			{
				text: 'Create path',
				onClick: () => {
					this.scene.run('CreatePath')
				}
			}
		]
		this.links.forEach((link, i) => {
			this.add.text(100, 150 + i * 20, link.text).setInteractive().on('pointerdown', link.onClick)
		})
	}

	update(time, delta) {
		this.text.setText(`${1000/delta}`)
	}
}

export default UI
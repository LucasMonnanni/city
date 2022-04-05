class UI extends Phaser.Scene {
	text: Phaser.GameObjects.Text
	links: {text: string, onClick: () => void}[]
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
				text: 'Delete Road',
				onClick: () => {
					this.scene.run('DeleteRoad')
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

	update(time: number, delta: number) {
		this.text.setText(`${1000/delta}`)
	}
}

export default UI
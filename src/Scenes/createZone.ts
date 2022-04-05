class CreateZone extends Phaser.Scene {
	create() {
		this.cameras.remove(this.cameras.main)
	}
}

export default CreateZone
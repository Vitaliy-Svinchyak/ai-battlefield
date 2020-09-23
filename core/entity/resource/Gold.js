import IEntity from "../IEntity.js"

const image = new Image()
image.src = 'images/gold.png'

export default class Gold  extends IEntity{
    image = image
}
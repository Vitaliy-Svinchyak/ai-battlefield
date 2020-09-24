import IResource from "./IResource.js"

const image = new Image()
image.src = 'images/gold.png'

export default class Gold extends IResource {
    image = image
}
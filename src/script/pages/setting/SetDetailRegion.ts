
// import { getState, addRegion, addDetailRegion, removeDetailRegion } from '../../modules/model'
// import CustomEventEmitter from "../../modules/CustomEventEmitter"
import { CustomEventEmitter } from '../../utils/index.js'
import { getState, addRegion, addDetailRegion, removeDetailRegion } from '../../modules/model.js'

interface DetailRegionData {
    [key: string]: {
        [key: string]: string;
    };
}

interface RegionData {
    detailRegion: DetailRegionData;
}

export default class SetDetailRegion extends HTMLElement {

    regionData: RegionData | null
    region: string

    constructor() {
        super()
        this.regionData = null
        this.region = ''
    }

    connectedCallback() {
        CustomEventEmitter.add('fetch-region-data', this.setRegionData.bind(this))
        CustomEventEmitter.add('set-favorite-regions', this.renderRegion.bind(this))
    }

    disconnectedCallback() {
        CustomEventEmitter.remove('fetch-region-data', this.setRegionData)
        CustomEventEmitter.remove('set-favorite-regions', this.renderRegion)
    }

    setRegionData(event: Event) {
        const customEvent = event as CustomEvent<{ regionData: RegionData }>
        this.regionData = customEvent.detail.regionData
        this.renderRegion()
    }   

    renderRegion() {
        const favoriteRegions = Object.keys(getState().regions)
        if (favoriteRegions.length < 1) return
        
        const fragment = new DocumentFragment()
        const template = (document.querySelector('#tp-favorite-region') as HTMLTemplateElement).content.firstElementChild
		const container = this.querySelector('.regions')!
        container.innerHTML = ''
        favoriteRegions.forEach( key => {
			const element = template!.cloneNode(true) as HTMLElement
			element.querySelector('span')!.textContent = key
			fragment.appendChild(element)
		})
        container.appendChild(fragment)

		const firstInput = container.querySelector('input')!
		firstInput.checked = true
        const label = (firstInput.nextElementSibling as HTMLElement).textContent || ''
		this.renderDetailRegions(label)
		this.changeRegion()
    }

    renderDetailRegions(regionName: string) { 
        const detailRegionsElement = this.querySelector('.detailRegions') as HTMLElement
        if (!this.regionData) return
        const regionObj = getState().regions[regionName]
        const regionCodes = regionObj? Object.values(regionObj) : []

        const template = (document.querySelector('#tp-detail-region') as HTMLTemplateElement).content.firstElementChild
		detailRegionsElement.innerHTML = ''
        const fragment = new DocumentFragment()

		const detailRegionData = this.regionData.detailRegion[regionName]
        if (!detailRegionData) return
		for (const [key, value] of Object.entries(detailRegionData)) {
            const element = template!.cloneNode(true) as HTMLElement
            element.querySelector('span')!.textContent = key
            const input = element.querySelector('input')!
			input.value = value
            if (regionCodes.includes(value)) {
                input.checked = true
                fragment.insertBefore(element, fragment.firstChild)
            } else {
                fragment.appendChild(element)
            }
		}
		detailRegionsElement.appendChild(fragment)
        this.region = regionName
		this.onChangeDetail()
	}

    changeRegion() {
		const regionRadios = this.querySelectorAll('[name=favorite-region]') 
        Array.from(regionRadios).forEach( (radio: Element) => {
            const inputRadio = radio as HTMLInputElement
            inputRadio.addEventListener('change', () => {
				if (inputRadio.checked) {
                    const label = inputRadio.nextElementSibling!.textContent || ''
					this.renderDetailRegions(label)
				}
			})
        })
	}

    onChangeDetail() {
        const region = this.region
        if (!getState().regions[region]) {
            addRegion(region)
        }
        const checkboxes = document.querySelectorAll('[name=detailRegion]')
        checkboxes.forEach( (checkbox : Element) => {
            const inputCheckbox = checkbox as HTMLInputElement
            inputCheckbox.addEventListener('change', () => {
                const { value } = inputCheckbox 
                const label = inputCheckbox.nextElementSibling!.textContent || ''
                if (inputCheckbox.checked) {
                    addDetailRegion(region, label, value)
                } else  {
                    removeDetailRegion(region, label)
                }
                CustomEventEmitter.dispatch('set-detail-regions', {})
            })
        })
    }
    
}
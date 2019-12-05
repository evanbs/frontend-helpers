import axios from 'axios';

interface PostcodeData {
    logradouro?: string;
    complemento?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
}

export default class Postcode {
    get postcodeInput(): HTMLInputElement {
        const element: HTMLInputElement | null = document.querySelector('input[postcode]');

        if (element === null) {
            throw Error('[Postcode] The postcode input element does not exits');
        }

        return element;
    }

    setStreetInput(street: string): void {
        const element: HTMLInputElement | null = document.querySelector('input[postcode-street]');

        if (element === null) {
            throw Error('[Postcode] The street input element does not exits');
        }

        element.value = street;
    }

    setComplementInput(complement: string): void {
        const element: HTMLInputElement | null = document.querySelector('input[postcode-complement]');

        if (element === null) {
            throw Error('[Postcode] The complement input element does not exits');
        }

        element.value = complement;
    }
    setDistrictInput(district: string): void {
        const element: HTMLInputElement | null = document.querySelector('input[postcode-district]');

        if (element === null) {
            throw Error('[Postcode] The district input element does not exits');
        }

        element.value = district;
    }

    setCityInput(city: string): void {
        const element: HTMLInputElement | null = document.querySelector('input[postcode-city]');

        if (element === null) {
            throw Error('[Postcode] The city input element does not exits');
        }

        element.value = city;
    }
    setStateInput(state: string): void {
        const element: HTMLInputElement | null = document.querySelector('input[postcode-state]');

        if (element === null) {
            throw Error('[Postcode] The state input element does not exits');
        }

        element.value = state;
    }

    setListener(): void {
        this.postcodeInput.addEventListener('blur', () => this.setFields());
    }

    async setFields() {
        const values = (await this.getPostcodeData()) as PostcodeData;

        this.setStreetInput(values.logradouro);
        this.setComplementInput(values.complemento);
        this.setDistrictInput(values.bairro);
        this.setCityInput(values.localidade);
        this.setStateInput(values.uf);
    }

    async clearFields() {
        this.setStreetInput('');
        this.setComplementInput('');
        this.setDistrictInput('');
        this.setCityInput('');
        this.setStateInput('');
    }

    async getPostcodeData<PostcodeData>(): Promise<PostcodeData> {
        const postcode = this.postcodeInput.value;
        const response = await axios.get(`https://viacep.com.br/ws/${postcode}/json/`);
        const postcodeData = await response.data;

        if (await this.isResponseValid(response)) {
            return postcodeData;
        } else {
            this.clearFields();
            throw Error('[Postcode] The API response is not valid');
        }
    }

    isResponseValid(response): boolean {
        let isValid: boolean = false;

        if (!Object.prototype.hasOwnProperty.call(response.data, 'erro') && response.status === 200) {
            isValid = true;
        }

        return isValid;
    }

    init(): void {
        try {
            if (this.postcodeInput) {
                this.setListener();
            }
        } catch (error) {
            console.error(error);
        }
    }
}

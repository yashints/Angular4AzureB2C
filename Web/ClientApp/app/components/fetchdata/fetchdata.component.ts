import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import {Auth} from "../../services/auth.service";

@Component({
    selector: 'fetchdata',
    templateUrl: './fetchdata.component.html'
})
export class FetchDataComponent {
    public forecasts: WeatherForecast[];

		constructor(http: Auth, @Inject('BASE_URL') baseUrl: string) {
			http.AuthGet(baseUrl + 'api/SampleData/WeatherForecasts').subscribe(result => {
            this.forecasts = result.json() as WeatherForecast[];
        }, error => console.error(error));
    }
}

interface WeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

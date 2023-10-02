import { AboutDisplay } from "./classes/aboutDisplay.js";
import { ColorGenerator } from "./classes/colorGenerator.js";
import { DomManager } from "./classes/domManager.js";
import { Exporter } from "./classes/exporter.js";
import { Indexer } from "./classes/indexer.js";
import { NotificationManager } from "./classes/notificationManager.js";
import { Debugger } from "./modules/debugger.js";
import * as Elements from "./modules/elements.js";

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./app/serviceWorker.js");
};

class App{
    constructor(){
        this.indexer        = new Indexer(this);
        this.colorGenerator = new ColorGenerator(this);
        this.domManager     = new DomManager(this);
        this.exporter       = new Exporter(this);
        this.notifier       = new NotificationManager(this);
        this.aboutDisplay   = new AboutDisplay(this);
    }

    async init(){
        // Initialize the modules
        await this.indexer.init();
        this.colorGenerator.init();
        this.domManager.init();
        this.exporter.init();

        // Generate initial palette
        await this.colorGenerator.generatePalette();

        // Hide loading screen
        Elements.LOADING_SCREEN.classList.add("hide");

        // Display version
        fetch('./data/version.json')
        .then((response) => response.json())
        .then((json) => {
            Elements.VERSION_TEXT.innerText = "v" + json["version"];
            this.aboutDisplay.init(json["changelog"]);
        });

        // Display DEBUG
        Debugger.debugMessage();
    }
}

addEventListener("DOMContentLoaded", () => {
    const app = new App();
    app.init();
})
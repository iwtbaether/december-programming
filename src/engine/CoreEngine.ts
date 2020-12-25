import {Datamap, newDefaultMap, setDecimals} from './Datamap';
import * as _ from 'lodash';
import { CraftingData_Init } from './m_st/Crafting';
import { AUTOSAVE_INTERVAL } from './Engine';

export const GAMEKEY = 'uglylikeme'

export default abstract class CoreEngine {

    abstract extraLoad: ()=>void;
    abstract processDelta (delta: number): void;

    datamap: Datamap = newDefaultMap();
    loop: NodeJS.Timeout | undefined = undefined;

    notify: VoidFunction = ()=>{};
    constructor(){
        //console.log('MADE ME');
        
        this.datamap.last = Date.now();
        //this.start();
        this.quietLoad();
    }

    setNotify (newnotify: VoidFunction) {
        this.notify = newnotify;
    }

    start = () => {
        if (!this.loop) {
            this.loop = setInterval(this.tick, 200);
            
        }
        this.extraLoad();
    }

    stop = () => {
        if (this.loop){
            clearTimeout(this.loop);
            this.loop = undefined;
        } 
    }

    save= () => {
        //console.log('saving');
        this.datamap.autosaveCounter = 0;
        
        console.log('saved');

        let stringy = JSON.stringify(this.datamap);
        let based = window.btoa(stringy);
        localStorage.setItem(GAMEKEY, based)

    }

    load= () => {
        this.quietLoad();        
        this.notify();
    }

    reset = () => {
        this.stop()
        this.datamap = newDefaultMap();
        this.checkSet();
        this.extraLoad();
        this.start();
        this.notify();
    }

    quietLoad = () => {
        let combstr = localStorage.getItem(GAMEKEY);
        
        if (combstr != null){
            let stringy = window.atob(combstr);
            let oldobj = JSON.parse(stringy);
            //console.log(oldobj);
            this.datamap = newDefaultMap();
            _.merge(this.datamap, oldobj)
        }

        this.checkSet();

        if (this.extraLoad) {
            this.extraLoad(); //doesn;t work when internally called
        } else 
            {
                //console.log('no extra load');
            }
    }
    
    tick = () => {
        
        
        let newnow = Date.now();
        let oldnow = this.datamap.last;
        let delta = newnow - oldnow;
        
        this.datamap.last = newnow;
        
        this.processDelta(delta)
        if (this.datamap.autosave) {
            this.datamap.autosaveCounter += delta;
            if (this.datamap.autosaveCounter >= AUTOSAVE_INTERVAL) this.save();
        }
        this.notify();
    }
    
    
    checkSet = () => {
        setDecimals(this.datamap);
    }

    import = (basedstr: string) => {
        this.datamap.autosave = false;

        //var LZUTF8 = require('lzutf8');

        //console.log(lzutf8str);

        //let arrayStr = lzutf8str.split(',')
        //let arrayInt = arrayStr.map(value => parseInt(value))
        //let magicArray = Uint8Array.of(...arrayInt);


        //var string = new TextDecoder("utf-8").decode(lzutf8str);
        //let test = new Uint8Array(lzutf8str)
        //let uint8array: Uint8Array = new Uint8Array(lzutf8str)
        //let uint8array = new Uint8Array()
        //var uint8array = new TextEncoder().encode(lzutf8str);
        //console.log(uint8array);

        //var output = LZUTF8.encodeUTF8(lzutf8str);
        //console.log(output, arrayStr, magicArray);

        //        let check = LZUTF8.decompress(magicArray);
        //console.log(check);

        /**
         * 
      */
        let plain = window.atob(basedstr);


        let combstr = plain;
        if (combstr != null) {
            let oldobj = JSON.parse(combstr);
            this.datamap = newDefaultMap();
            _.merge(this.datamap, oldobj)
        }

        this.datamap.autosave = false;
        this.checkSet();
        this.extraLoad();

    }

    export = () => {
        let dataString = JSON.stringify(this.datamap);
        let based = window.btoa(dataString);
        //var LZUTF8 = require('lzutf8');
        //let output = LZUTF8.compress(dataString);
        //  console.log(output)
        //console.log(dataString.length)

        //        download(`prophet_export_${Date.now()}.txt`,dataString)
        download(`todonamegame_export_${Date.now()}.txt`, based)

        function download(filename: string, text: string) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }

    }

    autosaveToggle = () => {
        this.datamap.autosaveCounter = 0;
        this.datamap.autosave = !this.datamap.autosave;
        this.notify();
    }

}



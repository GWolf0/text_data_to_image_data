import { useEffect, useState, useRef } from "react";
import AppService from "../services/appService";

let requestImageToText=false;
function TextDataToDataImage(){
//refs
const textAreaRef=useRef();
const fileInputRef=useRef();
const canRef=useRef();
const textToImageKeyInputRef=useRef();
const imageToTextKeyInputRef=useRef();
//states
const [textToImageInfos,setTextToImageInfos]=useState({charsCount:0,wordsCount:0});
const [imageToTextInfos,setImageToTextInfos]=useState({imageWidth:0,imageHeight:0});
const [imgFile,setImgFile]=useState(null);
//effects
useEffect(()=>{
    //init
    canRef.current.width=canRef.current.height=0;
},[]);
useEffect(()=>{
    if(imgFile!=null){
        drawImage(imgFile);
        updateImageInfo(imgFile);
    }
},[imgFile]);
useEffect(()=>{
    if(requestImageToText){
        drawImage(imgFile);
        updateImageInfo(imgFile);
        if(requestImageToText){
            getTextDataFromImageAndUpdateTextArea(imgFile);
            requestImageToText=false;
        }
    }
},[imgFile]);
//methods
//text to image things
function onTextAreaBlured(){
    const text=textAreaRef.current.value;
    const charsCount=text.split("").length;
    const wordsCount=text.split(" ").filter(w=>w!="").length;
    setTextToImageInfos({charsCount:charsCount,wordsCount:wordsCount});
}
function textToImage(){
    const text=textAreaRef.current.value;
    if(text.length<2)return Alert("Text too short!");
    const keyText=textToImageKeyInputRef.current.value;
    const key=AppService.textKeyToKey(keyText);
    const imgUrl=AppService.textToImage(text,key);
    const imgFile=new Image();
    imgFile.onload=()=>{
        setImgFile(imgFile);
    }
    imgFile.src=imgUrl;
}
//image to text things
function onFileInputChanged(){
    const files=fileInputRef.current.files;
    if(files.length<1)return;
    const file=files[0];
    const imgFileUrl=URL.createObjectURL(file);
    const imgFile=new Image();
    imgFile.onload=()=>{
        if(imgFile.width*imgFile.height>AppService.MAX_PIXELS_COUNT)return Alert(`Image size is too large (>${AppService.MAX_PIXELS_COUNT})`);
        setImgFile(imgFile);
        requestImageToText=true;
        fileInputRef.current.value="";
    }
    imgFile.src=imgFileUrl;
}
function imageToText(){
    fileInputRef.current.click();
}
async function getTextDataFromImageAndUpdateTextArea(imgFile){
    try{
        const keyText=imageToTextKeyInputRef.current.value;
        const key=AppService.textKeyToKey(keyText);
        const text=await AppService.imageToText(imgFile.src,key);
        textAreaRef.current.value=text;
        onTextAreaBlured();
    }catch(e){
        console.log(`ERROR: Couldn't get text from image!, ${e}`);
        Alert(`ERROR: Couldn't get text from image!, ${e}`);
    }
}
function drawImage(imageFile){
    const can=canRef.current;
    const cc=can.getContext('2d');
    cc.imageSmoothingEnabled=false;
    can.width=imageFile.width;
    can.height=imageFile.height;
    const cw=can.width;const ch=can.height;
    cc.clearRect(0,0,cw,ch);
    cc.drawImage(imageFile,0,0,cw,ch);
}
function updateImageInfo(imageFile){
    setImageToTextInfos({imageWidth:imageFile.width,imageHeight:imageFile.height});
}
function onDownloadImage(){
    if(imgFile==null)return;
    const link=document.createElement("a");
    link.href=imgFile.src;
    link.download="dataImg.png";
    link.click();
}


return(
<section id="textDataToDataImage" className="flex flex-col md:flex-row">
    <section id="textToImageSection" className="flex flex-col grow md:basis-0 border border-semitrans rounded md:mr-2 mb-2 md:mb-0" style={{height:'480px'}}>
        <div className="px-4 flex items-center border-b border-semitrans" style={{height:'48px'}}>
            <p className="text-dark text-sm font-semibold">Text To Image</p>
        </div>
        <div className="grow">
            <textarea ref={textAreaRef} onBlur={onTextAreaBlured} className="resize-none outline-none bg-light text-darker text-sm p-2 w-full h-full" placeholder="text.." maxLength={5000}></textarea>
        </div>
        <ul className="p-2 border-t border-semitrans">
            <li className="py-1 border-b border-semitrans text-dark text-xs md:text-sm">chars count: {textToImageInfos.charsCount}</li>
            <li className="py-1 border-b border-semitrans text-dark text-xs md:text-sm">words count: {textToImageInfos.wordsCount}</li>
        </ul>
        <div>
            <input ref={textToImageKeyInputRef} className="w-full h-8 bg-light outline-none text-accent text-sm text-center border-t border-semitrans" type="text" placeholder="key(optional)" />
        </div>
        <div className="px-4 bg-light flex items-center border-t border-semitrans" style={{height:'48px'}}>
            <button onClick={textToImage} className="ml-auto rounded px-4 py-2 bg-primary text-lighter text-sm hover:opacity-70">convert to image</button>
        </div>
    </section>
    <section id="imageToTextSection" className="flex flex-col grow md:basis-0 border border-semitrans rounded" style={{height:'480px'}}>
        <div className="px-4 flex items-center border-b border-semitrans" style={{height:'48px'}}>
            <p className="text-dark text-sm font-semibold">Image To Text</p>
        </div>
        <div className="grow flex items-center justify-center">
            <input ref={fileInputRef} onChange={onFileInputChanged} type="file" hidden accept="image/*" />
            <canvas id="can" ref={canRef} className="border border-semitrans"></canvas>
        </div>
        <ul className="p-2 border-t border-semitrans">
            <li className="py-1 border-b border-semitrans text-dark text-xs md:text-sm">image width: {imageToTextInfos.imageWidth}px</li>
            <li className="py-1 border-b border-semitrans text-dark text-xs md:text-sm">image height: {imageToTextInfos.imageHeight}px</li>
        </ul>
        <div>
            <input ref={imageToTextKeyInputRef} className="w-full h-8 bg-light outline-none text-accent text-sm text-center border-t border-semitrans" type="text" placeholder="key(optional)" />
        </div>
        <div className="px-4 bg-light flex items-center border-t border-semitrans" style={{height:'48px'}}>
            <button onClick={onDownloadImage} className="underline text-accent text-sm px-1 hover:opacity-70" hidden={imgFile==null}>Download</button>
            <button onClick={imageToText} className="ml-auto rounded px-4 py-2 bg-primary text-lighter text-sm hover:opacity-70">convert to text</button>
        </div>
    </section>
</section>
);
}

export default TextDataToDataImage;

class AppService{
    //consts
    static MAX_PIXELS_COUNT=16384;
    static DEFAULT_KEY=[255];

    //text to image & image to text functions (using the rgb values to store characters, alpha not used because it causes some issues)
    //text to image
    static textToImage(txt,key=AppService.DEFAULT_KEY){//console.log("the key",key);
        const can=document.createElement("canvas");
        const cc=can.getContext('2d');
        cc.imageSmoothingEnabled=false;
        const charCodes=txt.split('').map((char,i)=>{
            return Math.min(char.charCodeAt(0),255);
        });
        const imgSize=Math.ceil(Math.sqrt(charCodes.length/3));
        can.width=imgSize;can.height=imgSize;//let test=[];
        for(let y=0;y<can.height;y++){
            for(let x=0;x<can.width;x++){
                const idx=(x+y*can.width)*3;
                const chars=[];
                const curKey=[];
                for(let i=0;i<3;i++){
                    if(charCodes[idx+i])chars.push(charCodes[idx+i]);
                    else chars.push(null);//console.log("ii",(idx+1)%key.length)
                    //get key value for each pixel channel value in looping way by using modulo on pixel channel value respective index
                    curKey.push(key[(idx+i)%key.length]);
                }//console.log("key",curKey);
                if(chars.every(char=>char===null))break;
                const color=chars.map((char,j)=>char!=null?char:0).map((char,j)=>char^curKey[j]);//test.push(...color)
                cc.fillStyle=`rgba(${color[0]},${color[1]},${color[2]},${1})`;
                cc.fillRect(x,y,1,1);
            }   
        }
        const imgUrl=can.toDataURL();//console.log(test)
        can.remove();
        return imgUrl;
    }
    //image to text
    static imageToText(imgUrl,key=AppService.DEFAULT_KEY){//console.log("the key",key);
        return new Promise((resolve,reject)=>{
            const img=new Image();
            img.onload=()=>{
                const can=document.createElement("canvas");
                const cc=can.getContext('2d');
                cc.imageSmoothingEnabled=false;
                can.width=img.width;can.height=img.height;
                cc.drawImage(img,0,0,can.width,can.height);
                const imgData=cc.getImageData(0,0,can.width,can.height);//console.log(imgData.data)
                let text="";
                for(let row=0;row<can.height;row++){
                    for(let col=0;col<can.width;col++){
                        const index=(row*can.width+col)*4;
                        const keyIndex=(row*can.width+col)*3;
                        //get key value for each pixel channel value in looping way by using modulo on pixel channel value respective index
                        const curKey=[key[(keyIndex+0)%key.length],key[(keyIndex+1)%key.length],key[(keyIndex+2)%key.length]];//console.log("key",curKey);
                        const r=imgData.data[index];
                        const g=imgData.data[index+1];
                        const b=imgData.data[index+2];
                        //const a=imgData.data[index+3];
                        const rgb=[r^curKey[0],g^curKey[1],b^curKey[2]];
                        //check if rgb values equal curKey values(empty data pixel) then break loop
                        if(rgb.every((val,i)=>val===curKey[i]))break;//console.log(rgb)
                        //filter values that are equal to 0(empty value)
                        text+=rgb.filter(val=>val!==0).map((val,i)=>String.fromCharCode(val)).join("");
                    }
                }
                can.remove();
                resolve(text);
            }
            img.src=imgUrl;
        });
    }
    //text key to chars array key
    static textKeyToKey(txtKey){
        if(txtKey===""||txtKey===" ")return AppService.DEFAULT_KEY;
        return txtKey.split("").map(char=>char.charCodeAt(0));
    }

}

export default AppService;

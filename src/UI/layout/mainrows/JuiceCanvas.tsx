import React from "react";
import { gEngine } from "../../..";
import { percentOf, percentOfNum } from "../../../engine/externalfns/util";
import { I_FruitDecimals } from "../../../engine/garden/Garden";
import { GuideTypes } from "../../../engine/garden/Juice";


class JuiceCanvas extends React.Component<{juices: I_FruitDecimals, guide: GuideTypes}, {}> {

    canvasRef: React.RefObject<HTMLCanvasElement>;
    constructor(props: any) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.drawStar();
    }

    getBGColor = () => {
        switch (this.props.guide) {
            case GuideTypes.Sara:
                return 'rgb(0,0,200)'
                break;

                case GuideTypes.Guth:
                return 'rgb(0,200,0)'
                break;

                case GuideTypes.Zammy:
                return 'rgb(200,0,0)'
                break;
        
            default:
                return 'rgb(100,100,100)'
                break;
        }
    } 

    drawStar = () => {
        const cv = this.canvasRef.current;


        if (cv) {
            const ctx = cv.getContext('2d');
            if (ctx) {

                const juices = this.props.juices;
                ctx.lineWidth = 5;

                //background colored after guide
                ctx.fillStyle = this.getBGColor();
                ctx.fillRect(0,0,230,230);

                //circle to show radius 40 / 30% (where perks activate)
                ctx.fillStyle = 'rgb(30,30,30)'
                ctx.arc(115, 115, 40, 0, 2 * Math.PI);
                ctx.fill()
                
                //outline
                const lightDark = ( juices.hope ).div(juices.hope.add(juices.doom).add(1)).times(255).floor().toNumber();
                ctx.beginPath();
                ctx.strokeStyle = `rgb(${lightDark},${lightDark},${lightDark})`
                ctx.strokeRect(0, 0, 230, 230);
                
                const starTotal = juices.bunched.add(juices.circular).add(juices.egg).add(juices.square).add(juices.triangular).toNumber();
                const pointLengths = [
                    percentOfNum(juices.bunched.toNumber(),starTotal)+10,
                    percentOfNum(juices.circular.toNumber(),starTotal)+10,
                    percentOfNum(juices.egg.toNumber(),starTotal)+10,
                    percentOfNum(juices.square.toNumber(),starTotal)+10,
                    percentOfNum(juices.triangular.toNumber(),starTotal)+10,
                ]

                if (juices.bunched.greaterThan(100)) drawStar2(ctx, 38, 38 * 1, 5, 20, 10, 'silver', 'silver')
                if (juices.circular.greaterThan(100)) drawStar2(ctx, 38, 38 * 2, 5, 20, 10, 'silver', 'silver')
                if (juices.egg.greaterThan(100)) drawStar2(ctx, 38, 38 * 3, 5, 20, 10, 'silver', 'silver')
                if (juices.square.greaterThan(100)) drawStar2(ctx, 38, 38 * 4, 5, 20, 10, 'silver', 'silver')
                if (juices.triangular.greaterThan(100)) drawStar2(ctx, 38, 38 * 5, 5, 20, 10, 'silver', 'silver')

                if (pointLengths[0] >= 40 ) drawStar2(ctx, 230-38, 38 * 1, 5, 20, 10, 'gold', 'gold')
                if (pointLengths[1] >= 40 ) drawStar2(ctx, 230-38, 38 * 2, 5, 20, 10, 'gold', 'gold')
                if (pointLengths[2] >= 40 ) drawStar2(ctx, 230-38, 38 * 3, 5, 20, 10, 'gold', 'gold')
                if (pointLengths[3] >= 40 ) drawStar2(ctx, 230-38, 38 * 4, 5, 20, 10, 'gold', 'gold')
                if (pointLengths[4] >= 40 ) drawStar2(ctx, 230-38, 38 * 5, 5, 20, 10, 'gold', 'gold')
                

                drawFPointDiffLengthsStar(ctx, 115, 115, pointLengths, 10)
            }
        }
    }

    render() {
        this.drawStar();
        return (<div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
            <canvas ref={this.canvasRef} width={230} height={230} />
        </div>)
    }

}

export default JuiceCanvas;

function drawStar(ctx: CanvasRenderingContext2D,cx: number,cy: number,spikes: number,outerRadius: number,innerRadius: number){
    var rot=Math.PI/2*3;
    var x=cx;
    var y=cy;
    var step=Math.PI/spikes;

    ctx.beginPath();
    ctx.moveTo(cx,cy-outerRadius)
    for(let i=0;i<spikes;i++){
      x=cx+Math.cos(rot)*outerRadius;
      y=cy+Math.sin(rot)*outerRadius;
      ctx.lineTo(x,y)
      rot+=step

      x=cx+Math.cos(rot)*innerRadius;
      y=cy+Math.sin(rot)*innerRadius;
      ctx.lineTo(x,y)
      rot+=step
    }
    ctx.lineTo(cx,cy-outerRadius);
    ctx.closePath();
    ctx.lineWidth=5;
    ctx.strokeStyle='blue';
    ctx.stroke();
    ctx.fillStyle='skyblue';
    ctx.fill();
  }


function drawStar2(ctx: CanvasRenderingContext2D,cx: number,cy: number,spikes: number,outerRadius: number,innerRadius: number, stroke: string, fill: string){
    var rot=Math.PI/2*3;
    var x=cx;
    var y=cy;
    var step=Math.PI/spikes;

    ctx.beginPath();
    ctx.moveTo(cx,cy-outerRadius)
    for(let i=0;i<spikes;i++){
      x=cx+Math.cos(rot)*outerRadius;
      y=cy+Math.sin(rot)*outerRadius;
      ctx.lineTo(x,y)
      rot+=step

      x=cx+Math.cos(rot)*innerRadius;
      y=cy+Math.sin(rot)*innerRadius;
      ctx.lineTo(x,y)
      rot+=step
    }
    ctx.lineTo(cx,cy-outerRadius);
    ctx.closePath();
    ctx.lineWidth=5;
    ctx.strokeStyle=stroke;
    ctx.stroke();
    ctx.fillStyle=fill;
    ctx.fill();
  }

  function drawFPointDiffLengthsStar(ctx: CanvasRenderingContext2D,cx: number,cy: number,spikesRadi: number[]/*length 5*/,innerRadius: number){
    var spikes = 5;
    var rot=Math.PI/2*3;
    var x=cx;
    var y=cy;
    var step=Math.PI/spikes;

    ctx.beginPath();
    ctx.moveTo(cx,cy-spikesRadi[0])
    for(let i=0;i<spikes;i++){
      x=cx+Math.cos(rot)*spikesRadi[i];
      y=cy+Math.sin(rot)*spikesRadi[i];
      ctx.lineTo(x,y)
      rot+=step

      x=cx+Math.cos(rot)*innerRadius;
      y=cy+Math.sin(rot)*innerRadius;
      ctx.lineTo(x,y)
      rot+=step
        
    }
    ctx.lineTo(cx,cy-spikesRadi[0]);
    ctx.closePath();
    ctx.lineWidth=5;
    ctx.strokeStyle='blue';
    ctx.stroke();
    ctx.fillStyle='skyblue';
    ctx.fill();
  }
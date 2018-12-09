import React, {Component} from 'react';
import $ from 'jquery'; 
import ReactBootstrapSlider from 'react-bootstrap-slider';
import '../CSS/Slider.css'
export default class Slider extends Component {
    
    render(){
        return (
            <div id="slider">
           <ReactBootstrapSlider
                value={[this.props.startTime,this.props.endTime]}
                max={200}
                min={100} 
                change={this.props.onChange}
            />
            <div id="startTime">
            <form>
                
            <b> Start Time: </b>
            <b id="startTime"> {this.props.startTime}</b>
            <br></br>
            <b id="endTime"> End Time: </b>
            <b> {this.props.endTime}</b>
            <br></br>
            <input id="ok" onClick={this.props.onClick} className="btn btn-primary" type="button" value="Ok"></input>
          
  
</form>
</div>
            </div>
            
        )
        
    }
   
}
import React, { Component } from 'react';
import Popup from "reactjs-popup";
var valid_id = ['A434F11F1B05', 'A434F11EEE06', 'A434F11F1684', 'A434F11F1E86', 'A434F11EF48B', 'A434F11F2003',
            'A434F11EEF0E', 'A434F11EA281', 'A434F11F1D06', 'A434F11F1000', 'A434F11F1606', 'A434F11FF78E',
            'A434F11F3681', 'A434F11F0C80', 'A434F11F1B88', 'A434F11EF609', 'A434F11FFE0D', 'A434F11F1B8A',
            'A434F1201380', 'A434F11F1B07', 'A434F11F0E06', 'A434F11F2F84', 'A434F11F1001', 'A434F11A3408',
            'A434F1204007', 'A434F11EA080', 'A434F1201282', 'A434F11EF80D', 'A434F11F1404', 'A434F11F1486',
            'A434F11F1683', 'A434F11F1A0A', 'A434F11F1783', 'A434F11F118D', 'A434F11EEB80', 'A434F11F0E83',
            'A434F11F1083', 'A434F11F1B84', 'A434F11F1D04', 'A434F11F1482', 'A434F11F1187', 'A434F11F1C85',
            'A434F1204005', 'A434F11F1F03', 'A434F11F3902', 'A434F11EF68F', 'A434F11F1106', 'A434F11F1782',
            'A434F11F1607', 'A434F11F4287', 'A434F11F1F02', 'A434F11F1406', 'A434F11F0E85', 'A434F11EEF8C',
            'A434F11F1E09', 'A434F11F0E03', 'A434F11F1483', 'A434F11F1F85']
export default class Test extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isRepaired: false,
            showPopUp: false,
            repairs: [],
            isCorrectValue: false,
            currentID: '',
            correctedValue:[],
            stales: {},
            dictStale:{}
        }
        this.handleClickCell = this.handleClickCell.bind(this)
        this.handleClickRepair = this.handleClickRepair.bind(this)
        this.handleClickCellFalse = this.handleClickCellFalse.bind(this)
        this.closePopUp = this.closePopUp.bind(this)
    }
    
    handleClick(sensorID, prop) {
        var url = "http://127.0.0.1:5000/duration?start=" + this.props.start + "&end=" + this.props.end + "&sensorID=" + sensorID + "&prop=" + prop
        window.console.log(url)
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    window.console.log(result)
                    this.setState({
                        data: result,
                        showPopUp: true
                    })
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    window.console.log(error)
                }
            )
    }
   
    
      

    handleClickRepair() {
        window.console.log("test")
        this.setState({
            isRepaired: true
        })
    }
    showRepairs(sensorID,prop) {
        var repairs = this.props.repairs
        var array = []
        for (var i=0; i<repairs.length; i++ ) {
            var sensor_attr = repairs[i]["sensor_attr"]
            var id = sensor_attr.split("_")[0]
            var attr = sensor_attr.split("_")[1]
            if (id === sensorID && prop === attr) {
                array = repairs[i]["repair"]
            }
        }
        this.setState({
            repairs:array
        })
    }
    handleClickCell(e,sensorID,prop) {
        
        
        if (e.nativeEvent.which === 1) {
            console.log('Left click'); // left click
          } else if (e.nativeEvent.which === 3) {
            this.showRepairs(sensorID,prop)
            this.setState({
                showPopUp: true //right click
            })
          }
    }
    closePopUp() {
        this.setState({
          showPopUp: false
    
        })
      }
    handleClickCellFalse() {
        window.console.log("false")
    }
    checkUserInput(value,sensorID,prop) {
        var repairs = this.props.repairs
        var array = []
        for (var i=0; i<repairs.length; i++) {
            var sensor_attr = repairs[i]["sensor_attr"]
            var id = sensor_attr.split("_")[0]
            var attr = sensor_attr.split("_")[1]
            if (id === sensorID && prop === attr) {
                var repair = repairs[i]["repair"]
                var max = repair[0]["prob"]
                for (var j=0; j<repair.length; j++) {
                    if (j>0 && repair[j]["prob"] !== max) {
                        break
                    }
                    else {
                        var value2 = repair[j]["value"]
                        array.push(value2)
                    }
                }
            }
        }
       
       return array.includes(parseFloat(value))
       
    }
    checkValueInArrayCorrected(val) {
       
        return (this.state.correctedValue.includes(val))
    }
    createDictionary(data) {
        window.console.log(data)
        var dict = {};
        for (var i=0; i<valid_id.length; i++) {
          dict[valid_id[i]] = {}
  
        }
        
        for (var j=0; j<data.length; j++){
          var sensorID = data[j].split("_")[0]
          var prop = data[j].split("_")[1]
          var temp = dict[sensorID]
          temp[prop] = "#f44262"
          dict[sensorID] = temp
        }
       
        
        this.setState({
          dictStale: dict
        })
      }
    staleCells() {
        var url = "http://172.17.54.236:5000/stalecells"
          window.console.log(url)
          // this.props.history.push('/freq')
          fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
                 this.createDictionary(result["stalecells"]) 
                 
            },
         
            (error) => {
              window.console.log(error)
            }
          )
      }
      componentDidMount() {
        this.staleCells()
       }
    handleOnBlur(e,sensorID,prop) {
        window.console.log(e.target.textContent)
        if (this.checkUserInput(e.target.textContent,sensorID,prop)) {
            var x = this.state.dictStale
            x[sensorID][prop] = "#42f47a"
            window.console.log("fuck80")
            window.console.log(x)
            
            this.setState({
                stales: x
            })
            
        }
        else {
            var x = this.state.dictStale
            x[sensorID][prop] = "#f44262"
            window.console.log("fuck80")
            window.console.log(x)
            
            this.setState({
                stales: x
            })
        }
    }

    
    render() {
        
        window.console.log(this.state.dictStale)
        var dict = this.state.dictStale
        var valid_id = ['A434F11F1B05', 'A434F11EEE06', 'A434F11F1684', 'A434F11F1E86', 'A434F11EF48B', 'A434F11F2003',
            'A434F11EEF0E', 'A434F11EA281', 'A434F11F1D06', 'A434F11F1000', 'A434F11F1606', 'A434F11FF78E',
            'A434F11F3681', 'A434F11F0C80', 'A434F11F1B88', 'A434F11EF609', 'A434F11FFE0D', 'A434F11F1B8A',
            'A434F1201380', 'A434F11F1B07', 'A434F11F0E06', 'A434F11F2F84', 'A434F11F1001', 'A434F11A3408',
            'A434F1204007', 'A434F11EA080', 'A434F1201282', 'A434F11EF80D', 'A434F11F1404', 'A434F11F1486',
            'A434F11F1683', 'A434F11F1A0A', 'A434F11F1783', 'A434F11F118D', 'A434F11EEB80', 'A434F11F0E83',
            'A434F11F1083', 'A434F11F1B84', 'A434F11F1D04', 'A434F11F1482', 'A434F11F1187', 'A434F11F1C85',
            'A434F1204005', 'A434F11F1F03', 'A434F11F3902', 'A434F11EF68F', 'A434F11F1106', 'A434F11F1782',
            'A434F11F1607', 'A434F11F4287', 'A434F11F1F02', 'A434F11F1406', 'A434F11F0E85', 'A434F11EEF8C',
            'A434F11F1E09', 'A434F11F0E03', 'A434F11F1483', 'A434F11F1F85']
        return (
            <div>
            <table className="table table-striped" id="age">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">SensorID</th>
                        <th scope="col">Temperature</th>
                        <th scope="col">Humidity</th>
                        <th scope="col">AirPressure</th>
                        <th scope="col">Voltage</th>
                    </tr>
                </thead>
                <tbody>{this.props.data.map(function (item, key) {

                    return (

                        <tr key={key} >
                            <td>{key + 1}</td>
                            <td>{item["sensorID"]}</td>

                            <td 
                                contenteditable={this.props.isRepaired === true && dict[item["sensorID"]].hasOwnProperty("Temperature")? "true" : null}
                                onBlur={(e) => this.handleOnBlur(e,item["sensorID"],'Temperature')}
                                onContextMenu={(e) => this.props.isRepaired === true ? this.handleClickCell(e,item["sensorID"],'Temperature') : null} 
                                onClick={(e) => this.props.isRepaired === true ? this.handleClickCell(e,item["sensorID"],'Temperature') : null} 
                                style={{ cursor: this.props.isRepaired === true?  'pointer' : null,background: dict[item["sensorID"]].hasOwnProperty("Temperature")? dict[item["sensorID"]]["Temperature"]: null}}>
                                {item["temperature"]}
                                </td>
                            <td 
                                contenteditable={this.props.isRepaired === true && dict[item["sensorID"]].hasOwnProperty("Humidity")? "true" : null}
                                onBlur={(e) => this.handleOnBlur(e,item["sensorID"],'Humidity')}
                                onContextMenu={(e) => this.props.isRepaired === true ? this.handleClickCell(e,item["sensorID"],'Humidity') : null} 
                                onClick={(e) => this.props.isRepaired === true ? this.handleClickCell(e,item["sensorID"],'Humidity') : null} 
                                style={{ cursor: this.props.isRepaired === true?  'pointer' : null, background: dict[item["sensorID"]].hasOwnProperty("Humidity")? dict[item["sensorID"]]["Humidity"]: null}} >
                                {item["humidity"]}
                            </td>
                            <td 
                                contenteditable={this.props.isRepaired === true && dict[item["sensorID"]].hasOwnProperty("AirPressure")? "true" : null}
                                onBlur={(e) => this.handleOnBlur(e,item["sensorID"],'AirPressure')}
                                onContextMenu={(e) => this.props.isRepaired === true ? this.handleClickCell(e,item["sensorID"],'AirPressure') : null} 
                                onClick={(e) => this.props.isRepaired === true ? this.handleClickCell(e,item["sensorID"],'AirPressur') : null} 
                                style={{ cursor: this.props.isRepaired === true?  'pointer' : null, background: dict[item["sensorID"]].hasOwnProperty("AirPressure")? dict[item["sensorID"]]["AirPressure"]: null }} >
                                {item["airPressure"]}
                            </td>
                            <td 
                                contenteditable={this.props.isRepaired === true && dict[item["sensorID"]].hasOwnProperty("Voltage")? "true" : null}
                                onBlur={(e) => this.handleOnBlur(e,item["sensorID"],'Voltage')}
                                onContextMenu={(e) => this.props.isRepaired === true ? this.handleClickCell(e,item["sensorID"],'Voltage') : null} 
                                onClick={(e) => this.props.isRepaired === true ? this.handleClickCell(e,item["sensorID"],'Voltage') : null} 
                                style={{ cursor: this.props.isRepaired === true?  'pointer' : null, background: dict[item["sensorID"]].hasOwnProperty("Voltage")? dict[item["sensorID"]]["Voltage"]: null }} >
                                {item["voltage"]}
                            </td>
                        </tr>
                    )

                }.bind(this))}</tbody>
            </table>
            <Popup onClose={this.closePopUp} open={this.state.showPopUp} position="right center">
          <div className="table-wrapper-scroll-y">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Value</th>
                <th scope="col">Probability</th>

              </tr>
            </thead>
            <tbody>{this.state.repairs.map(function (item, key) {

              return (

                <tr key={key} >
                  <td>{key + 1}</td>


                  <td >{item["value"]}</td>
                  <td >{item["prob"]} %</td>
                </tr>
              )

            })}</tbody>
          </table>
          </div>
        </Popup>
            <input onClick={this.props.onClick}  id="identify" className="btn btn-primary" type="button" value="Repair"></input>
            
            </div>
        )

    }

}
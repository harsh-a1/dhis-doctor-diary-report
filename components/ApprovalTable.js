import React,{propTypes} from 'react';
import api from '../dhis2API';
import constants from '../constants'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';


export function ApprovalTable(props){
    
    var instance = Object.create(React.Component.prototype);
    instance.props = props;
    
    var state = {
        user : props.user,
        program : props.program,
        rawData:props.rawData,
        sdate : props.sdate,
        edate:props.edate,
        selectedOU:props.selectedOU,
        ous : props.ous,
        des : props.des
    };

    var ouMap = state.ous.reduce(function(map,obj){
        map[obj.id] = obj;
        return map;
    },[]);
        
    instance.render = render;
    return instance;
    
    function getHeader(){
        var list = [];
        list.push(<th className="approval_normal"  key="h_speciality">Speciality</th>);        
        list.push(<th className="approval_wideX"  key="h_ou">Org Unit</th>);        
        list.push(<th className="approval_wide" key="h_name of specilist">Name of Specialist</th>);        
        list.push(<th className="approval_normal"  key="h_code">Employee Code</th>);
        
        list.push(<th className="approval_normal"  key="h_working">Working</th>);
        /*
        list.push(<th className="approval_normal"  key="h_leave">Leave</th>);
        list.push(<th className="approval_normal"  key="h_offday">Off Day</th>);
        */
        state.des.
            reduce(function(list,obj){
                list.push(<th className={obj.valueType != "TEXT"?"approval_nonText":""} key={obj.id}>{obj.formName}</th>)
                return list;
            },list);

        return list;
    }

    function getRows(){
        
        return state.rawData.reduce(function(list,data){
            var dvMap = data.delist.reduce(function(map,obj){
                map[obj.split(":")[0]] = obj.split(":")[1];
                return map;                
            },[]);

            var attrMap = data.attrlist.reduce(function(map,obj){
                map[obj.split(":")[0]] = obj.split(":")[1];
                return map;                
            },[]);

            var _list = [];
            _list.push(<td className="approval_normal" key="d_speciality">{data.speciality}</td>);

            _list.push(<td className="approval_wideX" key="d_ou">{makeFacilityStrBelowLevel(ouMap[data.ouuid],2)}</td>);
            _list.push(<td className="approval_wide" key="d_name of specilist">{attrMap["U0jQjrOkFjR"]}</td>);
            _list.push(<td className="approval_normal" key="d_erhms code">{attrMap["T6eQvMXe3MO"]}</td>);

            _list.push(<td className="approval_normal" key="d_working">{dvMap["Working"]}</td>);
      /*      _list.push(<td className="approval_normal" key="d_leave">{dvMap["Leave"]}</td>);
            _list.push(<td className="approval_normal" key="d_offday">{dvMap["Off day"]}</td>);
      */
            state.des.reduce(function(_list,obj){
                _list.push(<td className={obj.valueType != "TEXT"?"approval_nonText":""}  key={"d"+obj.id+data.tei}>{dvMap[obj.id]}</td>)
                    return _list;
                },_list);

            list.push([<tr className={attrMap[constants.attr_releiving_date]?'relieved_doctor':''} key={data.tei}>{_list}</tr>]);
            return list;
        },[]);
       
    }
    
    function makeFacilityStrBelowLevel(ou,level){        
        return ou.ancestors.reduce(function(str,obj){
            if(obj.level>level){
                str = str + obj.name + " / " ;
            }
            return str;
        },"")  + ou.name;                
    }
    
    function render(){
        return ( 
                <div>
                <h5> Report </h5>

                <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button"
            table="table-to-xls"
            filename={"DD_MasterData_"+state.selectedOU.name+"_"+state.sdate+"-"+state.edate}
            sheet="1"
            buttonText="Download"/>

            
                <table className="approvalTable" id="table-to-xls">
                <thead>
                <tr>
                <th colSpan="2">{state.selectedOU.name}</th>
                <th colSpan={state.des.length+4}>{state.sdate} -  {state.edate}</th>

            </tr>
              
                <tr>
                {getHeader()}
            </tr>
                </thead>

                <tbody>
                
            {getRows()}
            </tbody>
                </table>
        
            </div>
        )
    }
    
}


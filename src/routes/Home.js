import { dbService } from "fbase";
import React, { useState } from "react";
import firebase from "firebase/app";

const Home = () =>{
    
    const [location, setLocation] = useState();
    const [sname, setSname] = useState("");
    if (navigator.geolocation) { // GPS를 지원하면
        navigator.geolocation.getCurrentPosition(pos=>{
            setLocation(pos.coords);
        },
        error =>{
            console.error(error);
        },
        {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: Infinity
        }
        ); 
      } else {
        alert('위치정보 불러오기 실패');
      }
      //위치정보 불러오기
    const onSubmit = (event) => {
        event.preventDefault();
        dbService.collection("storeinfo").add({
            sname,
            location: new firebase.firestore.GeoPoint(location.latitude,location.longitude), //위치
        });
        setSname("");
    };
    const onChange = (event) =>{
        const { target:{value}} = event;
        setSname(value);
    }
    return(<div>
        <form on onSubmit={onSubmit}>
            <input value={sname} onChange={onChange} type="text" placeholder="매장이름" maxLength={20}/>
            
            <input type="submit" value="등록" />
        </form>
    </div>
    );


};

export default Home;
import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import MenuLoad from "./MenuLoad"

var tp = 0
var todaySales = 0
const AddOrder = (StoreObj) => {
    const selectedStoreId = StoreObj.location.state.selectedStoreID
    const TableNo = StoreObj.location.state.tableObj.id

    const [menuList, setMenuList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [refresh, setRefresh] = useState(0);
    //const [todaySales, setTodaySales] = useState(0);

    useEffect(() => {
         dbService.collection("Tables").doc(TableNo).onSnapshot(function(doc) {
             setOrderList(doc.data().OrderArray)
             console.log("유즈팩트 토탈머니")
             tp = doc.data().TotalPrice
             //setTodaySales(doc.data().todaySales)
             //todaySales = doc.data().TodaySales
         })

         dbService.collection("storeinfo").doc(selectedStoreId).onSnapshot(function(doc) {
            //setTodaySales(doc.data().TodaySales)
            todaySales=doc.data().TodaySales
         })

        dbService.collection("menu").where
        ("StoreID", "==", selectedStoreId).onSnapshot(snapshot => {
            const menuArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMenuList(menuArray);
        });
    }, [refresh]);

    const SaveOrder = () => {

        dbService.collection("Tables").doc(TableNo).set({
            TotalPrice: tp,
            OrderArray: orderList
            }, {merge : true })
            setRefresh(1)
    }

    const MinusOrder = (event) => {
        event.preventDefault();
        const { target: { value } } = event;
        var test = 0

        for(var i = 0; i < orderList.length; i++) {
            if(orderList[i].menuName == value)
            {
                if(0 > orderList[i].totalPrice - orderList[i].singlePrice)
                {
                    alert("0원 이하입니다.")
                    return;
                }
                orderList[i].orderQuantity -= 1
                orderList[i].totalPrice -= orderList[i].singlePrice
                tp = tp-orderList[i].singlePrice
                SaveOrder()
                break
            }
        }
    }
    
    const AddOrder = (event) => { 
        event.preventDefault();
        const { target: { value } } = event;

        for(var i = 0; i < orderList.length; i++) {
            if(orderList[i].menuName == value)
            {
                
                orderList[i].orderQuantity += 1
                orderList[i].totalPrice += orderList[i].singlePrice 
                tp = tp+orderList[i].singlePrice

                SaveOrder()
                break
            }
        }
    }

    const Calculate = () => {
        console.log("정산 함수")
        console.log(todaySales)
        console.log(tp)
        todaySales=(tp+todaySales)
        //todaySales = todaySales + tp

        for(var i = 0; i < orderList.length; i++) {
                orderList[i].orderQuantity = 0
                orderList[i].totalPrice = 0
        }
        tp = 0
        
        dbService.collection("Tables").doc(TableNo).set({
            TotalPrice: tp,
            OrderArray: orderList,
            }, {merge : true })

        dbService.collection("storeinfo").doc(selectedStoreId).set({
            TodaySales: todaySales
            }, {merge : true })

            setRefresh(1)
    }

    
    const ShowOrderInfo = (menuName) => { // 배열객체 포문 돌려서 메뉴이름 일치하는 인덱스의 수량 리턴해 
       for(var i = 0; i < orderList.length; i++) {
            if(orderList[i].menuName == menuName)
            {
                return(
                <div>
                    <ul>
                        <li>
                            주문 수량: {orderList[i].orderQuantity}
                        </li>
                        <li>
                            현재 메뉴 가격: {orderList[i].totalPrice}
                        </li>
                        <li>
                            현제 테이블 총 주문 금액: {tp}
                        </li>
                    </ul>
                </div>
                )
            }
        }
    }

    return(
        <div>
            <div>
                현재 테이블 총 주문 금액: {tp}
            </div>
            <div>
            { menuList.map((obj) => (    //obj 는 menu 컬렉션의 하나하나의 문서들
                <div className="menu__container">
                { 
                    <div className="menu__obj">
                        <div className="menu__imgContainer">
                            {obj.attachmentUrl && <img className="menu__img" src={obj.attachmentUrl} />}
                        </div>
                        <div className="menu__info">
                            <h3>
                                메뉴 이름: {obj.Name}
                            </h3>
                            <h3>
                                메뉴 가격: {obj.Price} 원
                            </h3>

                            <div>
                                <button onClick={AddOrder} value={obj.Name}>+1</button>
                                <button onClick={MinusOrder} value={obj.Name}>-1</button>
                                <button onClick={Calculate} value={obj.Name}>계산하기</button>
                                    {
                                        ShowOrderInfo(obj.Name)
                                    }
                            </div>
                        </div>
                    </div>
                }
            </div>
                 ))}
            </div>
            
        </div>
    )
}

export default AddOrder;
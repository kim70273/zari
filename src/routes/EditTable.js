import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import AddOrder from "./AddOrder";
import { Link } from "react-router-dom";

const EditTable = (storeObj) => {
    if (!localStorage.getItem("EditTable")) {
        localStorage.setItem(
            "EditTable",
            JSON.stringify({
                location: storeObj.location,
                history: storeObj.history
            })
        );
    }
    const [tableArray, setTableArray] = useState([]);
    const [selectedStoreID,setselectedStoreI] = useState(JSON.parse(localStorage.getItem("EditTable")).location.state.storeObj);
    const [idList, setIdList] = useState([]); // Tables 컬렉션의 모든 문서 값들
    const hello = "HELLO"

    useEffect(() => {
        dbService.collection("Tables").where
            ("UniqueStoreId", "==", selectedStoreID).onSnapshot(snapshot => {
                const tableArray = snapshot.docs.map(doc => ({// Tables값 전체 가져오기

                    id: doc.id,
                    ...doc.data(),
                }));
                setTableArray(tableArray);

            });
    }, []
    );

    const checkLength = (event) => {
        event.preventDefault();
        console.log(idList.length)
        console.log(idList)

    }

    const AddTable = async (event) => {
        event.preventDefault();
        await dbService.collection("Tables").add({
            UniqueStoreId: selectedStoreID,
        });

    }

    const DeleteTable = async (event) => {
        event.preventDefault();
        const ok = window.confirm("해당 테이블을 삭제하시겠습니까?");
        if (ok) {
            const { target: { value } } = event;
            dbService.collection("Tables").doc(value).delete();
        }
    }

    return (
        <div>
            <div>
                <button onClick={checkLength}>idList 길이 확인</button>
            </div>
            <div>
                <button onClick={AddTable}>테이블 추가</button>
            </div>

            <div>
                {tableArray.map((obj) => (
                    <div>
                        <div>
                            <Link to={{
                                pathname: "/AddOrder",
                                state: {
                                    selectedStoreID,
                                    tableObj: obj
                                }
                            }
                            }>
                                <button >테이블 고유 번호 = {obj.id}</button>
                            </Link>
                            <button onClick={DeleteTable} value={obj.id}> 테이블 삭제 </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EditTable;
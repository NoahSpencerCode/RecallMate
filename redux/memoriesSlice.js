import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, getDocs, get, addDoc, doc, getCountFromServer, updateDoc, query, where, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebaseConfig';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Fib from '../Utils/Fib';
import VersionCheck from '../Utils/VersionCheck';

export const reviewMemory = createAsyncThunk(
    'memories/reviewMemories',
    async (req) => {
        try {
            const ref = doc(FIREBASE_DB, "users", req.myUID, "memories", req.memory.id)

            let nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + Fib(req.memory.timesReviewed+1))
            await updateDoc(ref, {
                version: "2.0",
                nextReviewDate: nextDate,
                timesReviewed: req.memory.timesReviewed + 1,
            })
            return { memory: req.memory }
        } catch (e) {
            console.error(e);
        }
    }
)

export const getAllMemories = createAsyncThunk(
    'memories/getAllMemories',
    async (req) => {
        try {
           
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 2);

            const usersRef = collection(FIREBASE_DB, "users", req.myUID, "memories");

            const q = query(usersRef, where("nextReviewDate", "<", tomorrow));

            const snap = await getDocs(q);

            let newMemories = []

            snap.forEach((doc) => {
                let data = doc.data()
                VersionCheck(data);
                const newMemory = {
                    id: doc.id,
                    version: data.version,
                    nextReviewDate: data.nextReviewDate.toDate().toString(),
                    timesReviewed: data.timesReviewed,
                    title: data.title,
                    text: data.text,
                    answer: data.answer,
                }

                newMemories.push(newMemory)
            })

            const count = await getCountFromServer(usersRef);


            return {newMemories, count: count.data().count}
        } catch (e) {
            console.error("ERROR FROM CATCH GETALLMEMPRIES ",e);
        }
            
    }
)


export const memoriesSlice = createSlice({
    name: 'memories',
    initialState: {
        documents: [],
        totalMemories: 0,
    },
    reducers: {
        newMemory: (state, action) => {
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const newMemory = {
                version: "2.0",
                id: uuidv4(), 
                nextReviewDate: tomorrow.toString(),
                timesReviewed: 0,
                title: action.payload.title,
                text: action.payload.text,
                answer: action.payload.answer,
            }
            state.documents.push(newMemory);
            state.totalMemories += 1;
            addDoc(collection(FIREBASE_DB, `users/${action.payload.myUID}/memories`), {
                version: "2.0",
                nextReviewDate: tomorrow,
                timesReviewed: 0, 
                title: action.payload.title,
                text: action.payload.text,
                answer: action.payload.answer,
            })
        },
        removeMemory: (state, action) => {
            console.log(action.payload.memory.id);
            const deleteIndex = state.documents.findIndex((element) => {
                return element.id === action.payload.memory.id
            });
            if (deleteIndex === -1) {return};
            state.documents.splice(deleteIndex,1);
            state.totalMemories -= 1;
            deleteDoc(doc(FIREBASE_DB, `users/${action.payload.myUID}/memories`, action.payload.memory.id ));
        },
    },
    
    extraReducers: (builder) => {
        builder.addCase(getAllMemories.fulfilled, (state, action) => {
            state.documents = action.payload.newMemories;
            state.totalMemories = action.payload.count;
        });
        builder.addCase(reviewMemory.fulfilled, (state, action) => {
            const memory = state.documents.find(obj => obj.id === action.payload.memory.id);
            let nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + Fib(memory.timesReviewed+1))
            memory.nextReviewDate = nextDate.toString();
            memory.timesReviewed += 1;
        });
    }

})

export const { newMemory, removeMemory } = memoriesSlice.actions

export default memoriesSlice.reducer
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, getDocs, addDoc, doc, getCountFromServer, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebaseConfig';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const reviewMemory = createAsyncThunk(
    'memories/reviewMemories',
    async (req) => {
        console.log('req', req);
        try {
            const ref = doc(FIREBASE_DB, "users", req.myUID, "memories", req.memory.id)
            await updateDoc(ref, {
                lastReviewDate: new Date().toString(),
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
           
            const usersRef = collection(FIREBASE_DB, "users", req.myUID, "memories");

            const snap = await getDocs(usersRef);

            let newMemories = []

            snap.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                const data = doc.data()
                const newMemory = {
                    id: doc.id,
                    lastReviewDate: data.lastReviewDate,
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
            const newMemory = {
                id: uuidv4(), 
                lastReviewDate: new Date().toString(),
                timesReviewed: 0,
                title: action.payload.title,
                text: action.payload.text,
                answer: action.payload.answer,
            }
            state.documents.push(newMemory);
            state.totalMemories += 1;
            addDoc(collection(FIREBASE_DB, `users/${action.payload.myUID}/memories`), {
                lastReviewDate: new Date().toString(),
                timesReviewed: 0, 
                title: action.payload.title,
                text: action.payload.text,
                answer: action.payload.answer,
            })
        },
        removeMemory: state => {
            state.value -= 1
        },
    },
    
    extraReducers: (builder) => {
        builder.addCase(getAllMemories.fulfilled, (state, action) => {
            state.documents = action.payload.newMemories;
            state.totalMemories = action.payload.count;
        });
        builder.addCase(reviewMemory.fulfilled, (state, action) => {
            const memory = state.documents.find(obj => obj.id === action.payload.memory.id);
            memory.lastReviewDate = new Date().toString();
            memory.timesReviewed += 1;
        });
    }

})

export const { newMemory, removeMemory } = memoriesSlice.actions

export default memoriesSlice.reducer
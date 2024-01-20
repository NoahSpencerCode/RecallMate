import { createSlice } from '@reduxjs/toolkit'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const memoriesSlice = createSlice({
    name: 'memories',
    initialState: [
        {
            id: uuidv4(),
            lastReviewDate: new Date('2024', 0, 14).toString(),
            timesReviewed: 0,
            title: 'React Hooks',
            text: "A list of react hooks",
        },
        {
            id: uuidv4(),
            lastReviewDate: new Date('2024', 0, 2).toString(),
            timesReviewed: 1,
            title: 'Git Rebase',
            text: "This is how you git rebase",
        },
        {
            id: uuidv4(),
            lastReviewDate: new Date('2024', 0, 3).toString(),
            timesReviewed: 3,
            title: 'git Branches',
            text: "commands for dealing with branches in git",
        },
        {
            id: uuidv4(),
            lastReviewDate: new Date('2024', 0, 4).toString(),
            timesReviewed: 4,
            title: 'Define Linoleate',
            text: "Linoleat is a fatty acid",
        },
    ],
    reducers: {
        newMemory: (state, action) => {
            console.log(action)
            const newMemory = {
                id: uuidv4(),
                lastReviewDate: new Date().toString(),
                timesReviewed: 0,
                title: action.payload.title,
                text: action.payload.text,
                answer: action.payload.answer,
            }
            state.push(newMemory)
        },
        removeMemory: state => {
            state.value -= 1
        },
        reviewMemory: (state, action) => {
            const memory = state.find(obj => obj.id == action.payload.currentMemory)
            memory.lastReviewDate = new Date().toString();
            memory.timesReviewed += 1
        }
    }
})

export const { newMemory, removeMemory, reviewMemory } = memoriesSlice.actions

export default memoriesSlice.reducer
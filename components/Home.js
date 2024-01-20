import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, Button, StyleSheet, Pressable, Platform } from 'react-native';
import { useSelector } from 'react-redux';

var fib = function(n) {
    return (n === 0 || n === 1) ? n : (fib(n - 1) + fib (n - 2));
};

const NextMemory = ({ title }) => {

    return (
        <Pressable style={nextStyles.frame}>
            <Text style={nextStyles.text}>{title}</Text>
        </Pressable>
    );
}

const nextStyles = StyleSheet.create({
    frame: {
        backgroundColor: '#39444f',
        borderRadius: '30px',
        height: 60,
        shadowColor: 'black',
        shadowOpacity: .5,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowRadius: 10,
    },
    text: {
        textAlign: 'center',
        color: 'grey',
        height: '100%',
        lineHeight: 60,
        fontSize: 20,
        shadowColor: 'black',
        shadowOpacity: .5,
        shadowOffset: {
            width: 1,
            height: 2,
        }
    }
});


const DateSeperator = () => {
    const date = new Date()
    date.setDate(date.getDate() + 1);
    return (
        <View>
            <Text style={{ color: 'grey', textAlign: 'center' }}>Tomorrow</Text>
            <Text style={{ color: 'grey', textAlign: 'center' }}>
                {date.toLocaleString('default', { month: 'long' })} {date.getDate()}
            </Text>
            <Dash />
        </View>
    )
}


const Dash = () => {
    return (
        <Text style={{ color: 'grey', textAlign: 'center', margin: 10 }}>|</Text>
    )
}

const Memory = ({ key, id, title, setCurrentPage, setCurrentMemory }) => {

    return (
        <Pressable style={memoryStyles.frame} onPress={() => {
            setCurrentMemory(id)
            setCurrentPage('MemoryViewer')
        }}>
            <Text style={memoryStyles.text}>{title}</Text>
        </Pressable>
    );
}

const memoryStyles = StyleSheet.create({
    frame: {
        backgroundColor: '#00a8f9',
        borderRadius: '30px',
        height: 60,
        shadowColor: 'black',
        shadowOpacity: .5,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowRadius: 10,
    },
    text: {
        textAlign: 'center',
        color: 'white',
        height: '100%',
        lineHeight: 60,
        fontSize: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowRadius: 10,
        textShadowOffset: {
            width: 1,
            height: 2,
        }
    }
});

const Home = ({ setCurrentPage, setCurrentMemory, isWeb }) => {

    const date = new Date()

    const oneDay = 24 * 60 * 60 * 1000;

    let defaultTodayMemories = [];

    let defaultTomorrowMemories = [];

    const reduxMemories = useSelector(state => state.memories)

    for (let i = 0; i < reduxMemories.length; i++) {
        const nextReviewDate = new Date(reduxMemories[i].lastReviewDate);
        nextReviewDate.setDate(nextReviewDate.getDate()+fib(reduxMemories[i].timesReviewed+1))
        const diffDays = Math.round((nextReviewDate - date) / oneDay)
        if (diffDays < 0) {
            defaultTodayMemories.push(reduxMemories[i])
        } else if (diffDays < 1.5) {
            defaultTomorrowMemories.push(reduxMemories[i])
        };
    }

    console.log("Rendered Home");

    const [isComplete, setIsComplete] = useState(false);
    const [numOfReviews, setNumOfReview] = useState(defaultTodayMemories.length);
    const [numOfMemories, setNumOfMemories] = useState(10);
    const [memories, setMemories] = useState(defaultTodayMemories)
    const [tomorrowMemories, setTomorrowMemories] = useState(defaultTomorrowMemories)
    return (
        <View style={styles.container}>
            <View style={styles.dateBox}>
                <Text style={styles.month}>{date.toLocaleString('default', { month: 'long' })}</Text>
                <Text style={styles.day}>{date.getDate()}</Text>
            </View>
            <View style={styles.stats}>
                <View style={styles.review}>
                    <Text style={styles.reviewText}> Review </Text>
                    <Text style={styles.reviewNumber}>{numOfReviews}</Text>
                </View>
                <View style={styles.total}>
                    <Text style={styles.totalText}> Memories </Text>
                    <Text style={styles.totalNumber}>{numOfMemories}</Text>
                </View>
            </View>

            <ScrollView style={styles.scroller}>

                {memories.map((memory, index) => {
                    return (
                        <View>
                            <Memory
                                key={index}
                                id={memory.id}
                                title={memory.title}
                                setCurrentPage={setCurrentPage}
                                setCurrentMemory={setCurrentMemory} 
                            />
                            <Dash />
                            {(index == memories.length - 1) ? <DateSeperator /> : null}
                        </View>
                    )
                })}
                {tomorrowMemories.map((memory, index) => {
                    return (
                        <View>
                            <NextMemory key={index} title={memory.title} />
                            {(index == tomorrowMemories.length - 1) ? null : <Dash />}
                        </View>
                    )
                })}

                <View style={{ height: 60 }} />

            </ScrollView>
            { !isWeb ?
                <Pressable style={styles.new} onPress={() => {
                    setCurrentPage('MemoryCreator')
                }}>
                    <Text style={styles.newText}>+</Text>
                </Pressable>
            :
                null
            }
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        margin: 0,
        paddingTop: 80,
        backgroundColor: '#05202a',
        flex: 1,
        ...Platform.select({
            web: {
                width: '50%',
                height: '100%',
                shadowColor: 'black',
                shadowRadius: 20,
                paddingTop: 25,
            }
        })
    },
    month: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30
    },
    day: {
        paddingLeft: 15,
        color: '#4dcbf7',
        fontWeight: 'bold',
        fontSize: 30
    },
    dateBox: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    stats: {
        paddingTop: 30,
        paddingBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    reviewText: {
        color: 'white',
        fontSize: 20
    },
    totalText: {
        color: 'white',
        fontSize: 20,
    },
    reviewNumber: {
        color: '#4dcbf7',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
    },
    totalNumber: {
        color: '#4dcbf7',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
    },
    scroller: {
        backgroundColor: '#1b3139',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
    },
    new: {
        bottom: 30,
        right: 30,
        position: 'absolute',
        height: 80,
        width: 80,
        backgroundColor: '#4dcbf7',
        borderRadius: '100%',
        shadowColor: 'black',
        shadowOpacity: .5,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowRadius: 10,
    },
    newText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 60,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowRadius: 10,
        textShadowOffset: {
            width: 1,
            height: 2,
        }
    }
});

export default Home;
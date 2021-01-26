import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import CheckBox from '@react-native-community/checkbox'

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            taskList: [],
            taskDesc: '',
            taskComplete: false
        }

        this.getTasks = this.getTasks.bind(this)
        this.addTask = this.addTask.bind(this)
        this.deleteTask = this.deleteTask.bind(this)
        this.renderTask = this.renderTask.bind(this)
    }

    componentDidMount() {
        return this.getTasks()
    }

    getTasks() {
        console.log("Get tasks");

        fetch("http://localhost:8000/tasks").then(
            response => response.json()
        ).then(data =>
            this.setState({
                taskList: data
            })
        )
    }

    renderTask(task) {
        return (
            <View style={{ flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center", marginVertical: 16 }}>
                <View
                    style={{
                        padding: 10,
                        backgroundColor: task.item.is_complete ? "#ddffdd" : "#ddddff",
                        marginRight: 16, flex: 0.7
                    }}
                >
                    <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>{task.item.description}</Text>
                </View>
                <TouchableOpacity style={{ padding: 10, backgroundColor: "#ffdddd", flex: 0.2 }}>
                    <Text
                        style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}
                        onPress={() => this.deleteTask(task)}
                    >
                        DELETE
                    </Text>
                </TouchableOpacity>
            </View >
        )
    }

    addTask() {
        fetch('http://localhost:8000/tasks', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: this.state.taskDesc,
                is_complete: this.state.taskComplete
            })
        });

        this.getTasks()
    }

    deleteTask(task) {
        fetch(`http://localhost:8000/tasks/${task.item.description}`, {
            method: 'DELETE'
        });

        this.getTasks()
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 30, fontWeight: "bold", }}>Todo</Text>

                <TouchableOpacity
                    style={{
                        marginTop: 96,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "royalblue",
                        height: 60,
                        width: 60,
                        borderRadius: 60 / 2
                    }}
                    onPress={this.addTask}
                >
                    <Text style={{ fontSize: 40, color: "white" }}>+</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", marginTop: 32, alignItems: "center" }}>
                    <TextInput placeholder="Task"
                        style={{
                            fontSize: 20,
                            borderColor: "royalblue",
                            borderWidth: 2,
                            padding: 15,
                            flex: 0.7,
                            borderRadius: 20,
                            marginRight: 16
                        }}
                        onChangeText={text => this.setState({ taskDesc: text })}
                        value={this.state.taskDesc}
                    />

                    <CheckBox onValueChange={value => this.setState({ taskComplete: value })} />
                </View>

                <FlatList
                    data={this.state.taskList}
                    keyExtractor={task => task.description.toString()}
                    renderItem={task => this.renderTask(task)}
                    style={{ width: "100%", marginTop: 64 }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 32
    }
})
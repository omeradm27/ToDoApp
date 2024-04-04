import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';

import TodoService from '../services/TodoService';
import moment from 'moment';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'colomn',
        backgroundColor: '#E4E4E4',
    },
    row: {
        flexDirection: 'row',
    },
    header: {
        backgroundColor: '#f0f2f5',
        padding: 10,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    section: {
       /*  margin: 10,
       flexGrow: 1, */
       flexDirection: "column",
       alignItems: "start",
       padding: 5,
       margin: 5,
       backgroundColor: '#f0f2f5',
    },
    todoItem: {
        margin: 10,
        flexGrow: 1,
        fontSize: 16,
    }
   
});

const MyDocument = ({ todos }) => {
    return (
        <Document>
            <Page size="A4" style={{}}>
               
                <View style={styles.header}>
                        <View style={styles.row}>
                        <Text   style={styles.todoItem}>
                             TODO
                        </Text>
                        <Text style={styles.todoItem}>
                            Date
                        </Text>
                        <Text style={styles.todoItem}>
                            Checked
                        </Text>
                        </View>
                    </View>            
                {todos.map(todo => (
                    
                    <View style={styles.section}>
                        <View style={styles.row}>
                        <Text  key={todo.id} style={styles.todoItem}>
                            {todo.text}  
                        </Text>
                        <Text  key={todo.id} style={styles.todoItem}>
                            {todo.time && moment(todo.time).format('YYYY-MM-DD')} 
                        </Text>
                        <Text  key={todo.id} style={styles.todoItem}>
                            {todo.checked ? 'Yes' : 'No'} 
                        </Text>
                        </View>
                    </View>
                ))}
            </Page>
        </Document>
    );
};


const PdfViewerButton = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await TodoService.getTodoByUserId(JSON.parse(localStorage.getItem('user')).id);
                setTodos(response);
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        };
        return () => fetchTodos();
    }, []);

    return (
        <PDFViewer style={{ width: '100%', height: '100vh' }}>
            {todos && <MyDocument todos={todos} />}
        </PDFViewer>
    );
};

export default PdfViewerButton;

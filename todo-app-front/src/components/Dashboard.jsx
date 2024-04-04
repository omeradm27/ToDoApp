import React, { useEffect, useState } from 'react';
import { List, Button, Checkbox, Space, Card, Modal, DatePicker } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'; // Import the icons
import { PDFViewer, Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import TodoService from '../services/TodoService';
import moment from 'moment';


const { RangePicker } = DatePicker;

const Dashboard = () => {
    const [todos, setTodos ] = useState();
    const [selectedTodos, setSelectedTodos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [dateRange, setDateRange] = useState([]);
    const [isUpdated, setIsUpdate] = useState(false);
    const navigate = useNavigate(); // Hook to access navigation functions

    const user_id=JSON.parse(localStorage.getItem('user')).id;

    useEffect(() => {
        const getTodos=async()=>{
           const response = await TodoService.getTodoByUserId(user_id);
           if(response&&response.length>0) {
            setTodos(response);
           }
        }
        return () => getTodos();
    }, [isUpdated]);
    const handleLogout=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    }
    const handleDeleteTodo = async(id) => {
        setIsUpdate(false);
        const response = await TodoService.deleteTodoById(id);
        if(response.success) {
            setIsUpdate(true);
        }

    };

    const handleCheckboxChange = async (id) => {
        try {
            const todoToUpdate = todos.find(todo => todo.id === id);
            const updatedTodo = { ...todoToUpdate, checked: todoToUpdate.checked?false:true }; // Toggle the checked property
            const response = await TodoService.updateTodoById(id, updatedTodo);
            if (response.success) {
                // Update the state with the updated todo item
                setTodos(prevTodos => {
                    return prevTodos.map(todo => {
                        if (todo.id === id) {
                            return updatedTodo;
                        }
                        return todo;
                    });
                });
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };
    
    

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const handleApplyDateRange = () => {
        setShowModal(false);
    };

    const handleCancelModal = () => {
        setShowModal(false);
        setDateRange([]); // Reset date range filter
    };

    const filteredTodos = todos&&todos.filter(todo => {
        if (dateRange?.length === 0) {
            return true;
        }
        const todoDate = todo.time ? moment(todo.time).format('YYYY-MM-DD') : null;
        return todoDate >= dateRange?.[0].format('YYYY-MM-DD') && todoDate <= dateRange?.[1].format('YYYY-MM-DD');
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <div style={{ position: 'fixed', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 30px ' }}>
                <div>
                    <span style={{ marginRight: '10px' }}><UserOutlined /></span>
                    Welcome {JSON.parse(localStorage.getItem('user')).username}
                </div>
            <   div className="text-2xl font-bold mb-6">TODO APP</div>
                <div>
                    <Button type="primary" size="large" style={{ marginRight: '10px',color: 'white', background: 'red' }}  icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
                </div>
            </div>
            <div className="flex items-end justify-end " style={{ width: 1000 }}>
                <Button className='mx-2' type="primary" onClick={() => setShowModal(true)}>Pick To Around</Button>
                <Button className='mx-2' type="primary"><Link to="/download">View PDF</Link></Button>
                <Button className='mx-2' type="primary"><Link to="/create">Create Todo</Link></Button>
            </div>
            <Modal
                title="Select Date Range"
                open={showModal}
                onOk={handleApplyDateRange}
                onCancel={handleCancelModal}
            >
                <RangePicker onChange={handleDateRangeChange} />
            </Modal>
            <Card bordered={false} style={{ width: 1000, marginTop: '10px', backgroundColor: '#3878c1' }}>
                <List
                    dataSource={filteredTodos}
                    renderItem={todo => (
                        <div style={{ borderRadius: '8px', marginBottom: '8px', padding: '8px', background: '#fff' }}>
                            <List.Item
                                actions={[
                                    <Space>
                                        <Button
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDeleteTodo(todo.id)}
                                        />
                                        <Button
                                            icon={<EditOutlined />}
                                            onClick={() => navigate(`/update/${todo.id}`)}
                                        />
                                    </Space>
                                ]}
                            >
                                <Space>
                                    <Checkbox
                                        checked={todo.checked}
                                        onChange={() => handleCheckboxChange(todo.id)}
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column', textDecoration: (todo.checked) ? 'line-through' : 'none' }}>
                                        <div><strong>{todo.text}</strong></div>
                                        <div>{todo.time && moment(todo.time).format('YYYY-MM-DD')}</div>
                                    </div>
                                </Space>
                            </List.Item>
                        </div>
                    )}
                />
            </Card>
        </div>
    );
};

export default Dashboard;

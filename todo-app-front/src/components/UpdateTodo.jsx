import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, DatePicker, Card, Checkbox } from 'antd';
import TodoService from '../services/TodoService';
import * as yup from 'yup';
import moment from 'moment';

const validationSchema = yup.object({
  text: yup.string().required('Todo text is required'),
  time: yup.date().required('Select a date'),
});

const UpdateTodo = () => {
    const { id } = useParams(); // Extracting the todo id from the URL
    const [inputText, setInputText] = useState('');
    const [selectedDate, setSelectedDate] = useState();
    const [apiError, setApiError] = useState({});
    const [data, setData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const response = await TodoService.getTodoById(id);
                setData(response);
                setInputText(response.text);
                setSelectedDate(moment(response.time));
            } catch (error) {
                console.error('Error fetching todo:', error);
            }
        };
        fetchTodo();
    }, [id]);

    const handleUpdateTodo = async () => {
        try {
            await validationSchema.validate({ text: inputText, time: selectedDate }, { abortEarly: false });
            const updatedTodo = {  text: inputText, time: selectedDate,user_id: data.user_id, checked: data.checked };
            const response = await TodoService.updateTodoById(id,updatedTodo);
            if (response.success) {
                navigate('/dashboard');
            }
        } catch (error) {
            setApiError(error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card title="Update Todo" bordered={false} style={{ backgroundColor: '#8fbde8' }}>
                <Input
                    placeholder="Enter a todo"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className='mb-4'
                />
                {apiError.text && <p style={{ color: 'red' }}>{apiError.text}</p>}
                <DatePicker
                    placeholder="Select Date"
                    className='mb-4 w-full'
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                />
                {apiError.time && <p style={{ color: 'red' }}>{apiError.time}</p>}
                <Checkbox className='mb-4' checked={data.checked} onChange={(e) => setData({ ...data, checked: e.target.checked })}>Done</Checkbox>

                <Button type="primary" className='w-full' onClick={handleUpdateTodo}>Update Todo</Button>
            </Card>
        </div>
    );
};

export default UpdateTodo;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, DatePicker, Card } from 'antd';
import TodoService from '../services/TodoService';
import * as yup from 'yup';

const validationSchema = yup.object({
  text: yup.string().required('Todo text is required'),
  time: yup.date().required('Select a date'),
});

const CreateTodo = () => {
    const [inputText, setInputText] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [apiError, setApiError] = useState({});
    const navigate = useNavigate();
    const user_id=JSON.parse(localStorage.getItem('user')).id;

    const handleSubmit = async () => {
        setApiError({});
        try {
            await validationSchema.validate({ text: inputText, time: selectedDate }, { abortEarly: false });
            const newTodo = { user_id: user_id, text: inputText, time: selectedDate, checked: false };
            const response = await TodoService.createTodo(newTodo);
            if(response.success) {
                navigate('/dashboard');
            }
        } catch (error) {
            setApiError(error.response.data);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card title="Create Todo" bordered={false} style={{ backgroundColor: '#8fbde8' }}>
                <Input
                    placeholder="Enter a todo"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className='mb-4'
                    help={apiError.text}
                />
                {apiError.text && <p style={{ color: 'red' }}>{apiError.text}</p>}
                <DatePicker
                    placeholder="Select Date"
                    className='mb-4 w-full'
                    value={selectedDate}
                    help={apiError.time}
                    onChange={(date) => setSelectedDate(date)}
                />
                {apiError.time && <p style={{ color: 'red' }}>{apiError.time}</p>}
                <Button type="primary" className='w-full' onClick={handleSubmit}>Create Todo</Button>
            </Card>
        </div>
    );
};

export default CreateTodo;

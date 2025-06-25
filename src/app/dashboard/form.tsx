import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        tag: '' // Only one tag
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, tag: e.target.value });
    }

    const handleTagSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // If the tag is valid, it gets set as the tag
        if (formData.tag) {
            alert(`Tag "${formData.tag}" added!`); // Optional: give feedback
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/submit', formData);
            alert(response.data);
        } catch (error) {
            console.error('Error sending data', error);
            alert('There was an error submitting the form.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <br />
            <label>
                Email:
                <input type="text" name="email" value={formData.email} onChange={handleChange} required />
            </label>
            <br />
            <label>
                Message:
                <textarea name="message" value={formData.message} onChange={handleChange} required />
            </label>
            <br />
            <div>
                <label>
                    Tag:
                    <input type="text" value={formData.tag} onChange={handleTagChange} />
                    <button
                        type="button"
                        onClick={handleTagSubmit}
                        style={{ marginLeft: '5px' }}
                        disabled={!formData.tag} // Disable if tag input is empty
                    >
                        Set Tag
                    </button>
                </label>
                {formData.tag && (
                    <button
                        type="button"
                        style={{ padding: '5px', marginLeft: '5px' }}
                        onClick={() => setFormData({ ...formData, tag: '' })}
                    >
                        {formData.tag} (Remove Tag)
                    </button>
                )}
            </div>
            <br />
            <button type="submit">Submit</button>
        </form>
    );
};

export default ContactForm;

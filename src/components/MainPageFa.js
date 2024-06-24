import React, { useState } from 'react';
import axios from 'axios';
import './components.css';
import { Button } from 'semantic-ui-react';
import Info from '../assets/icons/info.png';
import CustomModal from './CustomModal';
import { Link } from 'react-router-dom';

import { useNavigate } from "react-router-dom";



const MainPageFa = () => {
    const navigate = useNavigate();
    const baseURL = 'http://46.249.98.145:8000/api'

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [clothingType, setClothingType] = useState();
    const [recommendations, setRecommendations] = useState([]);
    const [ratings, setRatings] = useState();
    const [csrf, setCsrf] = useState(null);
    const [successRating, setSuccessRating] = useState(false);
    const [helpful, setHelpful] = useState();
    const [diverse, setDiverse] = useState();
    const [usage, setUsage] = useState();
    const [gender, setGender] = useState();
    const [name, setName] = useState();
    const [age, setAge] = useState();
    const [error, setError] = useState();
    const [waiting, setWaiting] = useState(false);
    const [inputError, setInputError] = useState(0);
    const [showModal, setShowModal] = useState(true);
    const [imagePath, setImagePath] = useState();



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleClothingTypeChange = (e) => {
        setClothingType(e.target.value);
    };

    const handleUsage = (e) => {
        setUsage(e.target.value);
    };

    const handleGender = (e) => {
        setGender(e.target.value);
    };

    const getCsrfToken = async () => {
        try {
            const response = await axios.get('http://46.249.98.145:8000/api/csrf/');
            return response.data.csrfToken;
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
            return null;
        }
    };

    const resetForm = () => {
        setName();
        setAge();
        setGender();
        setUsage();
        setDiverse();
        setRatings();
        setHelpful();
    }

    const resetResults = () => {
        setRecommendations([]);
        setImagePath();
        setSuccessRating(false);
        setError(false);
        resetForm();
        setImagePreview('');

    }

    const sortResponse = (result) => {
        result.sort((a, b) => b.score[0] - a.score[0]);
        return result;

    }

    const handleSubmit = async (e) => {
        resetResults();
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);
        formData.append('clothing_type', clothingType);
        try {
            const csrfToken = await getCsrfToken();
            setCsrf(csrfToken);
            if (!csrfToken) {
                console.error('CSRF token is missing');
                return;
            }
            setWaiting(true)
            const response = await axios.post('http://46.249.98.145:8000/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrfToken,
                },
            });
            let test = response.data.recommendations;
            // recommendations.sort((a, b) => a.score[0] - b.score[0]);
            test = sortResponse(test);
            setImagePreview('')
            setRecommendations(test);
            console.log("print sorted", test);
            setWaiting(false);
            setImagePath(response.data.image_path)
            console.log("recommandetions response:", response.data);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            if (image) {
                reader.readAsDataURL(image);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleRatingChange = (e) => {
        if (e.target.value > 10 || e.target.value < 1) {
            setInputError(1)
            return 1;
        }
        setInputError(0)

        setRatings(e.target.value);
    };

    const handleDiverseChange = (e) => {
        if (e.target.value > 10 || e.target.value < 1) {
            setInputError(1)
            return 1;
        }
        setInputError(0)
        setDiverse(e.target.value);
    };

    const handleHelpfulChange = (e) => {
        if (e.target.value > 10 || e.target.value < 1) {
            setInputError(1)
            return 1;
        }
        setInputError(0)
        setHelpful(e.target.value);
    };

    const scores = ['اولین گزینه', 'دومین گزینه', 'سومین گزینه', 'چهارمین گزینه',
        'پنجمین گزینه', 'ششمین گزینه', 'هفتمین گزینه', 'هشتمین گزینه', 'نهمین گزینه',
        'دهمین گزینه', 'یازدهمین گزینه', 'دوازدهمین گزینه', 'سیزدهمین گزینه', 'چهاردهمین گزینه',
        'پانزدهمین گزینه', 'شانزدهمین گزینه', 'هفدهمین گزینه', 'هجدهمین گزینه',
        'نوزدهمین گزینه', 'بیستمین گزینه', 'بیست و یکمین گزینه',
    ]


    const handleRatingSubmit = async () => {
        try {
            if (!csrf) {
                console.error('CSRF token is missing');
                return;
            }
            console.log("info", name, age, ratings, helpful, diverse, usage);

            await axios.post('http://46.249.98.145:8000/api/rate/', {
                name: name,
                age: age,
                gender: gender,
                rating: ratings,
                helpful: helpful,
                diverse: diverse,
                usage: usage,
                image: imagePath,
                // suggestions: recommendations
            }, {
                headers: {
                    'X-CSRFToken': csrf,
                    // 'Authorization': `Token ${token}`,
                },
            });
            setSuccessRating(true);
            setError(false)
            resetForm();
            console.log('Rating submitted successfully');

        } catch (error) {
            setError(error.response.data.error)
            setSuccessRating(false)
            console.error('Error submitting rating:', error.response.data.error);
        }
    };


    const handleLogout = () => {
        localStorage.clear();
    }

    return (
        <div className='main-page' style={{ direction: 'rtl' }}>
            <span className='info-icon' onClick={() => setShowModal(!showModal)}><img src={Info} /></span>

            <button className='ui button lang' onClick={() => navigate('/en')}>English</button>

            {showModal && (
                <CustomModal setShowModal={setShowModal} />
            )}
            <h2 className='title fa'>تصویر لباس خود را وارد کنید تا بهتون پیشنهاد بدیم</h2>

            <div className='image-form-container'>
                <form className='' onSubmit={handleSubmit}>
                    {imagePreview && (
                        <div>
                            <div className="ui medium image  uploaded-image">
                                <img src={imagePreview} alt="uploaded image" />
                            </div>
                        </div>

                    )}

                    <div className='ui form fields'>
                        <div className="ui file input image-input-field">
                            <input onChange={handleImageChange} required type="file" />
                        </div>
                        <div className='select-type image-input-field'>
                            <select value={clothingType} onChange={handleClothingTypeChange} className="ui dropdown" required>
                                <option value="">مدل لباس</option>
                                <option value="shirt">لباس</option>
                                <option value="pants">شلوار</option>
                            </select>
                        </div>
                    </div>

                    <button className=" submit-form-image ui button teal" type="submit">برو بریم‌ :)</button>
                </form>
            </div>


            <div>
                <h3>پیشنهادهامون:</h3>



                <div>
                    <div className='loading'>
                        {waiting && (
                            <div className=''>
                                <div className="ui segment loading-container">
                                    <br />
                                    <div className="ui medium centered active loader"></div>
                                    <br />
                                    <p></p>
                                    <p>منتظر باشید تا پیشنهادامونو براتون آماده کنیم...</p>
                                </div>

                            </div>
                        )}
                    </div>
                    <div className="recommendations-container">

                        {recommendations.map((image, index) => (
                            <div className="ui card">
                                {(image.score == 0) ? <div style={{ color: 'red' }}>
                                    متاسفانه چیزی براتون پیدا نکردیم. لطفا با یه عکس دیگه امتحان کنید.
                                </div> : <></>}

                                <div className="recommendation-item">
                                    <img className='recommendation-image' key={index} src={`http://46.249.98.145:8000${image.image}`} alt="Recommended" />
                                </div>
                                <div className="content">
                                    <div className="description">
                                        {scores[index]}
                                        {/* {index + 1} */}
                                    </div>

                                    <div className='header '>{parseInt(image.score * 100) / 10}%</div>
                                </div>

                            </div>
                        ))}


                    </div>



                    {!successRating && error && <b style={{ color: 'red' }}>{error}</b>}
                    {!error && successRating && <h3 className='success-rating' style={{ color: 'teal' }}>Thank You for Rating!</h3>}

                    {recommendations.length > 0 && (
                        <div className='form-container'>
                            <div className="ui form equal width fields">
                                <div className="fields">
                                    <div className="field">
                                        <label>نام</label>
                                        <input type="text" placeholder="نام" onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                    <div className="field">
                                        <label>سن</label>
                                        <input min='1' type="number" placeholder="سن" onChange={(e) => setAge(e.target.value)} required />
                                    </div>
                                    <div className="field">
                                        <label>جنسیت</label>
                                        <select value={gender} onChange={handleGender} className="ui dropdown" required>
                                            <option value="">یک گزینه را انتخاب کنید</option>
                                            <option value="female">خانم</option>
                                            <option value="male">آقا</option>
                                            <option value="male">سِکرِته</option>
                                        </select>
                                    </div>

                                </div>
                                {inputError == 1 && (
                                    <b style={{ color: 'red' }}>یک عدد بین ۱ تا ۱۰ انتخاب کنید.</b>
                                )}
                                <div className="fields">

                                    <div className="field">
                                        <label>فکر میکنید پیشنهادهامون چقدر خوبن؟
                                            (۱-۱۰)
                                        </label>
                                        <input
                                            required
                                            // className='ui button'
                                            type="number"
                                            min="1"
                                            max="10"
                                            onChange={handleRatingChange}
                                        />
                                        {/* <button className='ui button teal' onClick={handleRatingSubmit}>Submit Rating</button> */}
                                        <br />
                                    </div>
                                    <div className="field">
                                        <label>چقدر
                                            فکر میکنید این پیشنهادها برای شما مفیدن؟
                                            (۱-۱۰)
                                        </label>
                                        <input
                                            required
                                            // className='ui button'
                                            type="number"
                                            min="1"
                                            max="10"
                                            onChange={handleHelpfulChange}
                                        />
                                        {/* <button className='ui button teal' onClick={handleRatingSubmit}>Submit Rating</button> */}
                                        <br />
                                    </div>
                                    <div className="field">
                                        <label>به تنوع پیشنهادها چه امتیازی میدید؟
                                            (۱-۱۰)
                                        </label>
                                        <input
                                            // className='ui button'
                                            required
                                            type="number"
                                            min="1"
                                            max="10"
                                            onChange={handleDiverseChange}
                                        />
                                        <br />
                                    </div>

                                    <div className="field">
                                        <label>آیا از این سیستم برای کارای روزانه استفاده خواهید کرد؟</label>
                                        <select value={usage} onChange={handleUsage} className="ui dropdown" required>
                                            <option value="">یک گزینه را انتخاب کنید</option>
                                            <option value="yes">حتما</option>
                                            <option value="no">اصلا</option>
                                        </select>
                                        <br />
                                    </div>
                                </div>
                                <button className='ui button teal' onClick={handleRatingSubmit}>ارسال امتیاز</button>

                            </div>
                        </div>
                    )}



                </div>
            </div>
        </div >
    );
};

export default MainPageFa;

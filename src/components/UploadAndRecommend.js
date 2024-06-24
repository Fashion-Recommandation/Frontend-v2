import React, { useState } from 'react';
import axios from 'axios';
import './components.css';
import { Button } from 'semantic-ui-react';
import Info from '../assets/icons/info.png';
import CustomModal from './CustomModal';
import { useNavigate } from 'react-router-dom';



const UploadAndRecommend = () => {
    const baseURL = 'http://46.249.98.145:8000/api'

    const navigate = useNavigate();

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
            console.log(response.data)
            let test = response.data.recommendations;
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

    const scores = [
        'First Item', 'Second Item', 'Third Item', 'Fourth Item',
        'Fifth Item', 'Sixth Item', 'Seventh Item', 'Eighth Item',
        'Ninth Item', 'Tenth Item', 'Eleventh Item', 'Twelfth Item',
        'Thirteenth Item', 'fourteenth Item', 'fifteenth Item', 'Sixteenth Item',
        'Seventeenth Item', 'Eighteenth Item', 'Nineteenth Item', 'Twentieth Item',
    ]

    return (
        <div className='main-page'>
            <span className='info-icon' onClick={() => setShowModal(!showModal)}><img src={Info} /></span>
            <button className='ui button lang' onClick={() => navigate('/')}>Farsi</button>
            {showModal && (
                <CustomModal setShowModal={setShowModal} />
            )}
            <h2 className='title eng'>Upload Your Image and Get Recommendations</h2>

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
                                <option value="">Clothing Type</option>
                                <option value="shirt">Shirt</option>
                                <option value="pants">Pants</option>
                            </select>
                        </div>
                    </div>

                    <button className=" submit-form-image ui button teal" type="submit">Submit</button>
                </form>
            </div>


            <div>
                <h3>Recommendations:</h3>
                <div>
                    <div className='loading'>
                        {waiting && (
                            <div className=''>
                                <div className="ui segment loading-container">
                                    <br />
                                    <div className="ui medium centered active loader"></div>
                                    <br />
                                    <p></p>
                                    <p>We are preparing your recommandations...</p>
                                </div>

                            </div>
                        )}
                    </div>
                    <div className="recommendations-container">

                        {recommendations.map((image, index) => (

                            <div className="ui card">
                                {(image.score == 0) ? <div style={{ color: 'red' }}>Sorry we didn't find you anything. Please try with another image.</div> : <></>}

                                <div className="recommendation-item">
                                    <img className='recommendation-image' key={index} src={`http://46.249.98.145:8000${image.image}`} alt="Recommended" />
                                </div>
                                <div className="content">
                                    <div className="description">{scores[index]}</div>

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
                                        <label>Name</label>
                                        <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                    <div className="field">
                                        <label>Age</label>
                                        <input min='1' type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)} required />
                                    </div>
                                    <div className="field">
                                        <label>gender</label>
                                        <select value={gender} onChange={handleGender} className="ui dropdown" required>
                                            <option value="">Select an option</option>
                                            <option value="female">Female</option>
                                            <option value="male">Male</option>
                                            <option value="male">Prefer not to say</option>
                                        </select>
                                    </div>

                                </div>
                                {inputError == 1 && (
                                    <b style={{ color: 'red' }}>You should enter a number between 1 to 10</b>
                                )}
                                <div className="fields">

                                    <div className="field">
                                        <label>Do you think how these recommandations are good?(1-10)</label>
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
                                        <label>Do you think this recommandations are helpful for you?(1-10)</label>
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
                                        <label>Do you think our system recommands diverse clothes?(1-10)</label>
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
                                        <label>Will you use this system to choose your daily clothes?</label>
                                        <select value={usage} onChange={handleUsage} className="ui dropdown" required>
                                            <option value="">Select an option</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                        <br />
                                    </div>
                                </div>
                                <button className='ui button teal' onClick={handleRatingSubmit}>Submit Rating</button>

                            </div>
                        </div>
                    )}



                </div>
            </div>
        </div >
    );
};

export default UploadAndRecommend;

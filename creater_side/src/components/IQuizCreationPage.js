import React from 'react'
import '../css/iquiz_creation_page.css'

const IQuizCreationPage = () => {
  return (

    <div className='iquizCreationSection'>
        <div className='iquizCreationPart1'>
            <div className='questions'>Question 1</div>
            <div className='questions'>Question 2</div>
            <div className='questions'>Question 3</div>
            <div className='addMoreBtn'>Add more</div>
        </div>
        <div className='iquizCreationPart2'>
            <form className='addingIQuizForm'>
                <div className='title_button'>
                    {/* <div className='part1'></div> */}
                    <div className='part1'>
                        <input
                            type='text'
                            required
                            placeholder='Type your question'
                        />
                    </div>
                    <div className='part2'>
                        <button>Save</button>
                    </div>
                </div>
                <div className='question_timer'>
                    <div className='part1'>1</div>
                    <div className='part2'>
                        <textarea
                            type='text'
                            required
                            placeholder='Type your question'
                        />
                    </div>
                    <div className='part3'>
                        <select>
                            <option>10 second</option>
                            <option>20 second</option>
                            <option>30 second</option>
                        </select>
                    </div>
                </div>
                <div className='options'>
                    <div className='option'>
                        <div>
                            <textarea 
                                required 
                                placeholder='Enter your first option'
                            />
                        </div>
                        <div>
                            <textarea 
                                required 
                                placeholder='Enter your second option'
                            />
                        </div>
                    </div>
                    <div className='option'>
                        <div>
                            <textarea 
                                required 
                                placeholder='Enter your third option'
                            />
                        </div>
                        <div>
                            <textarea 
                                required 
                                placeholder='Enter your fourth option'
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default IQuizCreationPage;
import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const CustomerSwipper = () => {


    const [Customers, setCustomers] = useState([
        {
            id: '1',
            name: 'Aarco Designers',
            image: Images.customers.customer1
        },
        {
            id: '2',
            name: 'Mithrava',
            image: Images.customers.customer2
        },
        {
            id: '3',
            name: 'PC Designs',
            image: Images.customers.customer3
        }

    ])



    return (
        <div className="project-customer_swipper-main">
            <div className="customer_swipper-header">
                <div className="header-title">Businesses that Trust Us</div>
            </div>
            <div className="customer_swipper-content-main">

                <Swiper
                    slidesPerView={1}
                    spaceBetween={15}
                    centeredSlides={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: true,
                    }}
                    navigation={false}
                    pagination={{
                        clickable: true,
                    }}
                    breakpoints={{

                        640: {
                            slidesPerView: 2,
                            spaceBetween: 0,
                        },
                        768: {
                            slidesPerView: 4,
                            spaceBetween: 40,
                        },
                        1024: {
                            slidesPerView: 5,
                            spaceBetween: 50,
                        },
                    }}
                    modules={[Autoplay, Pagination]}
                    className="customer_swipper-swipper"
                >

                    {Customers.map((customer, index) => (
                        <SwiperSlide
                            key={customer.id}
                        >
                            <div className="customer_swipper-slide">
                                <img src={customer.image} alt={customer.name} />
                            </div>
                        </SwiperSlide>
                    ))}


                </Swiper>

            </div>
        </div>
    )
}

export default CustomerSwipper;
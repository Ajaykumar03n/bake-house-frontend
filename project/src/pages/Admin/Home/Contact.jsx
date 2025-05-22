import React, { useState } from 'react';
export const Contact = () => {
    return (

        <div class="container">
            <header id="header">
                <div class="nav-logo">
                    <p class="nav-name">Siva<span style="color: #8749f2;">Kavindra</span></p>
                </div>
                <div class="nav-menu" id="myNavMenu">
                    <ul class="nav_menu_list">
                        <li class="nav_list"><a href="#home" class="nav-link active-link">Home</a></li>
                        <li class="nav_list"><a href="#about" class="nav-link">About</a></li>
                        <li class="nav_list"><a href="#projects" class="nav-link">Projects</a></li>
                        <li class="nav_list"><a href="#contact" class="nav-link">Contact</a></li>
                    </ul>
                </div>
                <div class="mode">
                    <div class="moon-sun" id="toggle-switch">
                        <i class="fa fa-moon" id="moon"></i>
                        <i class="fa fa-sun" id="sun"></i>
                    </div>
                </div>
                <div class="nav-menu-btn">
                    <i class="uil uil-bars" onclick="toggleMenu()"></i>
                    <i class="uil uil-times" id="closeBtn" onclick="toggleMenu()" style="display: none;"></i>
                </div>
            </header>

            <main class="wrapper">
                <section class="featured-box" id="home">
                    <div class="featured-text">

                        <div class="hello">
                            <p>I,m Siva Kavindra</p>
                        </div>
                        <div class="featured-name">
                            <span class="typedtext"></span>
                        </div>
                        <div class="text-info">
                            <p style="text-align: center;">I,m currently pursuing BE (3rd year) in domain Computer
                                Science and Design</p>
                        </div>
                        <div class="text-btn">
                            <button class="btn hire-btn"><a href="#contact" style="text-decoration: none;color:#fff">Contact
                                Me</a></button>
                            <button class="btn"><a
                                href="https://drive.google.com/file/d/15PWbGJJRXc-es2OQzV1WDr3yrvws_P0f/view?usp=drive_link"
                                style="text-decoration:none;">View Resume </a><i class="uil uil-file"></i></button>
                        </div>
                        <div class="social_icons">
                            <div class="icon"><a href="https://www.linkedin.com/in/siva-kavindra-17b245259/"><i
                                class="uil uil-linkedin-alt"></i></a></div>
                            <div class="icon"><a href="https://github.com/SivaKavindraTamilselvan?tab=repositories"><i
                                class="uil uil-github-alt"></i></a></div>
                        </div>
                    </div>
                </section>

                <section class="section" id="about">
                    <div class="top-header">
                        <h1>About Me</h1>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="row-about">
                                <div class="about-info">
                                    <figure class="about-me">
                                        <figcaption>
                                            <img src="" alt="" class="profile" />
                                            <h2>Web development</h2>
                                            <p>Hello! I'm Siva Kavindra, a passionate Software
                                                Developer with a knack for creating innovative solutions to complex
                                                problems.
                                            </p>
                                        </figcaption>
                                    </figure>
                                    <button class="about-me-btn"><a href="#contact"
                                        style="text-decoration: none;color:#fff">Contact Me</a></button>
                                </div>
                                <div class="about-info-concept">
                                    <figure class="about-me-concept">
                                        <figcaption>
                                            <h2>Soft Skills</h2>
                                            <ul>
                                                <li>Resilience</li>
                                                <li>Leadership</li>
                                                <li>Work Management</li>
                                                <li>Adaptability</li>
                                            </ul>
                                        </figcaption>
                                    </figure>
                                </div>
                                <div class="about-info-concept">
                                    <figure class="about-me-concept">
                                        <figcaption>
                                            <h2>Concept</h2>
                                            <ul>
                                                <li>Git & GitHub</li>
                                                <li>Data Structures</li>
                                                <li>Object Oriented Programming(OOPS)</li>
                                                <li>DBMS</li>
                                                <li>Computer Network</li>
                                            </ul>
                                        </figcaption>
                                    </figure>
                                </div>
                            </div>
                        </div>
                        <div class="skill">
                            <h3 class="skill-head">Programming Language</h3>
                            <div class="skill-box">
                                <span class="title">C</span>
                                <div class="skill-bar">
                                    <span class="skill-peer c">
                                        <span class="tooltip">85%</span>
                                    </span>
                                </div>
                            </div>
                            <div class="skill-box">
                                <span class="title">Java</span>
                                <div class="skill-bar">
                                    <span class="skill-peer java">
                                        <span class="tooltip">90%</span>
                                    </span>
                                </div>
                            </div>
                            <div class="skill-box">
                                <span class="title">Python</span>
                                <div class="skill-bar">
                                    <span class="skill-peer python">
                                        <span class="tooltip">75%</span>
                                    </span>
                                </div>
                            </div>
                            <div class="skill-box">
                                <span class="title">JavaScript</span>
                                <div class="skill-bar">
                                    <span class="skill-peer javascript">
                                        <span class="tooltip">60%</span>
                                    </span>
                                </div>
                            </div>
                            <h3 class="skill-head">Front-End Tools</h3>
                            <div class="skill-box">
                                <span class="title">HTML</span>
                                <div class="skill-bar">
                                    <span class="skill-peer html">
                                        <span class="tooltip">80%</span>
                                    </span>
                                </div>
                            </div>
                            <div class="skill-box">
                                <span class="title">CSS</span>
                                <div class="skill-bar">
                                    <span class="skill-peer css">
                                        <span class="tooltip">75%</span>
                                    </span>
                                </div>
                            </div>
                            <div class="skill-box">
                                <span class="title">React JS</span>
                                <div class="skill-bar">
                                    <span class="skill-peer react">
                                        <span class="tooltip">80%</span>
                                    </span>
                                </div>
                            </div>
                            <h3 class="skill-head">Back-End Tools</h3>
                            <div class="skill-box">
                                <span class="title">Node JS</span>
                                <div class="skill-bar">
                                    <span class="skill-peer node">
                                        <span class="tooltip">80%</span>
                                    </span>
                                </div>
                            </div>
                            <div class="skill-box">
                                <span class="title">Spring Boot</span>
                                <div class="skill-bar">
                                    <span class="skill-peer spring">
                                        <span class="tooltip">60%</span>
                                    </span>
                                </div>
                            </div>
                            <div class="skill-box">
                                <span class="title">Django</span>
                                <div class="skill-bar">
                                    <span class="skill-peer django">
                                        <span class="tooltip">40%</span>
                                    </span>
                                </div>
                            </div>
                            <h3 class="skill-head">DataBase</h3>
                            <div class="skill-box">
                                <span class="title">MySQL</span>
                                <div class="skill-bar">
                                    <span class="skill-peer mysql">
                                        <span class="tooltip">80%</span>
                                    </span>
                                </div>
                            </div>
                            <div class="skill-box">
                                <span class="title">Mongo DB</span>
                                <div class="skill-bar">
                                    <span class="skill-peer mongo">
                                        <span class="tooltip">80%</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="section" id="projects">
                    <div class="top-header">
                        <h1>Projects</h1>
                    </div>
                    <div class="project-container">
                        <div class="project-box">
                            <i class="uil uil-invoice"></i>
                            <h3>Star-Autos</h3>
                            <div class="project-content">
                                <label>Developed a website for the company StarAutos formanaging the company
                                    vehicle data.</label>
                            </div>
                            <div class="viewmore">
                                <h2><a href="https://github.com/SivaKavindraTamilselvan/STAR_AUTOS">View More</a></h2>
                                <div class="icon"><i class="uil uil-arrow-right"></i></div>
                            </div>
                        </div>
                        <div class="project-box">
                            <i class="uil uil-university"></i>
                            <h3>College Placement</h3>
                            <div class="project-content">
                                <label>Built a full-stack system to streamline student placement processes for
                                    colleges and companies.</label>
                            </div>
                            <div class="viewmore">
                                <h2><a href="https://github.com/SivaKavindraTamilselvan/collegeplacement">View More</a></h2>
                                <div class="icon"><i class="uil uil-arrow-right"></i></div>
                            </div>
                        </div>
                        <div class="project-box">
                            <i class="uil uil-book-open"></i>
                            <h3>Book Library</h3>
                            <div class="project-content">
                                <label>Designed a digital library platform enabling students to browse and pre-booking
                                    enabling dual login access.</label>
                            </div>
                            <div class="viewmore">
                                <h2><a href="https://github.com/SivaKavindraTamilselvan/BOOK_LIBRARY-B20">View More</a></h2>
                                <div class="icon"><i class="uil uil-arrow-right"></i></div>
                            </div>
                        </div>
                        <div class="project-box">
                            <i class="uil uil-postcard"></i>
                            <h3>Postal Application</h3>
                            <div class="project-content">
                                <label>MERN stack website developed for the postal service in India. Helping the philatelist
                                    to collect the stamps</label>
                            </div>
                            <div class="viewmore">
                                <h2><a href="https://github.com/SivaKavindraTamilselvan/department_of_post_-fullstack-">View
                                    More</a></h2>
                                <div class="icon"><i class="uil uil-arrow-right"></i></div>
                            </div>
                        </div>
                        <div class="project-box">
                            <i class="uil uil-shopping-basket"></i>
                            <h3>Dark Pattern Extension</h3>
                            <div class="project-content">
                                <label>Extension used to find the dark pattern in the ecommerce website. The extension was
                                    developed using Javascript.</label>
                            </div>
                            <div class="viewmore">
                                <h2><a
                                    href="https://github.com/SivaKavindraTamilselvan/DarkPatternHackathon_WorkWizard_KEC_Perundurai">View
                                    More</a></h2>
                                <div class="icon"><i class="uil uil-arrow-right"></i></div>
                            </div>
                        </div>
                        <div class="project-box">
                            <i class="uil uil-shopping-cart"></i>
                            <h3>E-commerce website Back-End</h3>
                            <div class="project-content">
                                <label>A backend application for e-commerce website created using springboot.</label>
                            </div>
                            <div class="viewmore">
                                <h2><a href="https://github.com/SivaKavindraTamilselvan/ecommerce">View More</a></h2>
                                <div class="icon"><i class="uil uil-arrow-right"></i></div>
                            </div>
                        </div>
                        <div class="project-box">
                            <i class="uil uil-bill"></i>
                            <h3>Banking website Back-End</h3>
                            <div class="project-content">
                                <label>A backend application for banking application created using springboot.</label>
                            </div>
                            <div class="viewmore">
                                <h2><a href="https://github.com/SivaKavindraTamilselvan/banking">View More</a></h2>
                                <div class="icon"><i class="uil uil-arrow-right"></i></div>
                            </div>
                        </div>
                        <div class="project-box">
                            <i class="uil uil-university"></i>
                            <h3>Simple College Live Dashboard</h3>
                            <div class="project-content">
                                <label>Dashboard mentioning the number of students and facutly in the department. (Pie-chart
                                    & Bar-chart)</label>
                            </div>
                            <div class="viewmore">
                                <h2><a href="https://github.com/SivaKavindraTamilselvan/cn">View More</a></h2>
                                <div class="icon"><i class="uil uil-arrow-right"></i></div>
                            </div>
                        </div>
                        <div class="project-box">
                            <i class="uil uil-puzzle-piece"></i>
                            <h3>Simple Quiz Web</h3>
                            <div class="project-content">
                                <label>A simple quiz website is created. This project include both the cmd project and
                                    web(HTML).</label>
                            </div>
                            <div class="viewmore">
                                <h2><a href="https://github.com/SivaKavindraTamilselvan/commandlineinterface-quiz-js-">View
                                    More</a></h2>
                                <div class="icon"><i class="uil uil-arrow-right"></i></div>
                            </div>
                        </div>
                        <div class="project-box">
                            <i class="uil uil-servers"></i>
                            <h3>Console Application</h3>
                            <div class="project-content">
                                <label>Console Application using Java (OOPS concept). The application developed are added in
                                    the git.</label>
                            </div>
                            <div class="viewmore">
                                <h2><a href="https://github.com/SivaKavindraTamilselvan/consoleapplications">View
                                    Website</a></h2>
                                <div class="icon"><i class="uil uil-arrow-right"></i></div>
                            </div>
                        </div>
                        <div class="project-box">
                            <i class="uil uil-upload"></i>
                            <h3>URL Shortner</h3>
                            <div class="project-content">
                                <label>A URL Shortner website created where the long URL can be shortned.</label>
                            </div>
                            <div class="viewmore">
                                <h2><a href="https://github.com/SivaKavindraTamilselvan/url">View More</a></h2>
                                <div class="icon"><i class="uil uil-arrow-right"></i></div>
                            </div>
                        </div>
                    </div>
                </section>


            </main>
            <footer>
                <div class="middle-footer">
                    <ul class="footer-menu">
                        <li class="footer_menu_list">
                            <a href="#home">Home</a>
                        </li>
                        <li class="footer_menu_list">
                            <a href="#about">About</a>
                        </li>
                        <li class="footer_menu_list">
                            <a href="#projects">Projects</a>
                        </li>
                        <li class="footer_menu_list">
                            <a href="#contact">Contact</a>
                        </li>
                    </ul>
                </div>
                <div class="footer-social-icons">
                    <div class="icon"><a href="https://www.linkedin.com/in/siva-kavindra-17b245259/"><i
                        class="uil uil-linkedin-alt"></i></a></div>
                    <div class="icon"><a href="https://github.com/SivaKavindraTamilselvan?tab=repositories"><i
                        class="uil uil-github-alt"></i></a></div>
                </div>
            </footer>
        </div>
    );
};

-- ==============================
-- INSERT COURSES
-- ==============================

-- Faculty Compulsory Courses (48 credit hours)
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-00101', 'Linear Algebra', 3, 'Systems of linear equations, Matrices, Determinants, Euclidean spaces, Linear combinations and linear span, Subspaces, Linear independence, Basis and dimension, Rank of a matrix, Inner products, Eigen values and Eigen vectors', 'faculty_obligatory', TRUE, NOW()),
('02-24-00102', 'Calculus', 3, 'Functions and models, Limits and derivatives, Differentiation rules, Applications of differentiation, Integrals and applications of integration, Techniques of integration, Differential equations, Partial differential equations', 'faculty_obligatory', TRUE, NOW()),
('02-24-00103', 'Introduction to Computer Systems', 3, 'Introduction to computer systems, Representation and manipulation of information, Machine level representation of programs, Introduction to computer organization, Memory hierarchy, System I/O, Introduction to computer networks', 'faculty_obligatory', TRUE, NOW()),
('02-24-00104', 'Introduction to Data Sciences', 3, 'Introduction to data science, Data science ecosystem, Data representation and manipulation, Tools for data scientists, Data analytics tracks, Case studies using R', 'faculty_obligatory', TRUE, NOW()),
('02-24-00105', 'Programming I', 3, 'Introduction to programming, Basic programming constructs, Branching and Iteration, Decomposition, Abstractions and Functions, Recursion, Structure types, Mutability, High order functions, Testing and debugging', 'faculty_obligatory', TRUE, NOW()),
('02-24-00106', 'Probability and Statistics I', 3, 'Sets, Techniques of counting, Probability spaces, Independence and dependence, Conditional probabilities, Random variables, Expectation, variance, and moments, Moment generating functions, Independence of random variables, Conditional expectation, Discrete and continuous distributions, Joint and marginal distributions', 'faculty_obligatory', TRUE, NOW()),
('02-24-00107', 'Discrete Structures', 3, 'Sequences and Summations, Growth of functions, Logic and Predicates, Proof techniques, Recursive relations, Advanced counting techniques, Functions and Relations, Graph and Tree structures, Introduction to number theory: Groups, Rings, and Fields', 'faculty_obligatory', TRUE, NOW()),
('02-24-00108', 'Data Structures and Algorithms', 3, 'Arrays, Linear lists, Queues, and Stacks, Tree structures and traversals, Dictionaries and Search trees, Heaps, Tries, Sorting and Searching, Hashing, Basic graph algorithms: Traversals, Minimum Spanning Trees, Shortest Paths', 'faculty_obligatory', TRUE, NOW()),
('02-24-00109', 'Introduction to Artificial Intelligence', 3, 'Reasoning, Intelligent agents, Knowledge representation techniques, Problem solving by searching, Constraint satisfaction problems, Logic programming, Uncertain knowledge and probabilistic reasoning, Planning, Applications', 'faculty_obligatory', TRUE, NOW()),
('02-24-00110', 'Programming II', 3, 'Object-oriented programming concepts, UML and requirement analysis, Object-oriented design, Encapsulation and information hiding, Separation of interface and implementation, Classes and objects, Methods, Members, Subclasses and inheritance, Polymorphism, Using an object-oriented programming language, Message passing, Operator overloading, Genericity, Programming using threads, Using APIs, Software design patterns', 'faculty_obligatory', TRUE, NOW()),
('02-24-00201', 'Probability and Statistics II', 3, 'Normal distribution, Law of large numbers, Central limit theorem, Distributions derived from Normal distribution: Chi-squared, Student-t, and F distributions, Statistical estimation, Point estimation, Confidence intervals, Test of hypotheses, Fitting straight lines, Analysis of variance, Stochastic models, Poisson processes', 'faculty_obligatory', TRUE, NOW()),
('02-24-00202', 'Introduction to Databases', 3, 'Information management concepts, Database systems concepts, Data modeling, The relational data model and Relational algebra, Logical database design, Normalization, Query languages, Query optimization, Physical database design, B trees and Indices, Transaction processing concepts, Concurrency control, Recovery, Recent trends in database systems', 'faculty_obligatory', TRUE, NOW()),
('02-24-00203', 'Numerical Computations', 3, 'Matrix manipulation, Simultaneous linear equations and matrix inversion, Vector space and basis, Eigen values and Eigen vectors, Approximation of roots of equations, Error analysis and Numerical instability, Numerical differentiation and integration, Interpolation and Extrapolation, Least-square approximation, Differential equations', 'faculty_obligatory', TRUE, NOW()),
('02-24-00204', 'Cloud Computing', 3, 'Introduction to Cloud Computing, Cloud computing platforms and infrastructure, Parallel programming in the Cloud, Distributed storage systems, Virtualization, Cloud security, Cloud performance', 'faculty_obligatory', TRUE, NOW()),
('02-24-00205', 'Machine Learning', 3, 'Feature representation, Similarity, Dimensionality reduction, Supervised learning, Regression, Unsupervised learning, Evaluation, Fundamentals of neural networks (Feedforward and Backpropagation), Reinforcement learning, Applications', 'faculty_obligatory', TRUE, NOW()),
('02-24-00206', 'Data Mining and Analytics', 3, 'Introduction to data mining, Data exploration and visualization, Data preprocessing, Classification: concepts, basic techniques and evaluation, advanced methods (support vector machines and Bayesian networks), Mining frequent patterns and associations: concepts, techniques and evaluation, Clustering: concepts, techniques, and evaluation, Selected advanced topics (text mining), Current trends in data mining', 'faculty_obligatory', TRUE, NOW());

-- Faculty Elective Courses (12 credit hours required)
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-00301', 'Software Engineering', 3, 'Concepts of software development, Software life cycle and process models, Software project management, Software tools and environments, Requirements engineering, Data and process modeling, Software design techniques, Software coding, Software verification and validation, Software evolution, Software reliability, Formal methods', 'faculty_elective', TRUE, NOW()),
('02-24-00302', 'Systems Analysis and Design', 3, 'Introduction to systems analysis and design, Analysis and design tools, Advanced systems design concepts, Case studies and practical projects, Current trends in systems development', 'faculty_elective', TRUE, NOW()),
('02-24-00303', 'Algorithm Design', 3, 'Asymptotic notations, Solving recursive relations, Basic analysis measures: Worst and average-case complexity bounds, Amortized analysis, Randomization, Fundamental design strategies: Divide-and-conquer, Dynamic programming, and Greedy methods, String algorithms, Geometric algorithms, Number-theoretic algorithms, Complexity classes, NP-complete problems, Approximation algorithms', 'faculty_elective', TRUE, NOW()),
('02-24-00304', 'Distributed Processing', 3, 'Parallel and distributed systems architecture models, Distributed communication and message passing (Case Studies: sockets, RPC, RMI, MPI), Distributed naming, Distributed file systems (Case Studies: Network File System, Andrew File System, Google File System), Distributed synchronization, Fault tolerance and recovery protocols, Consistency models (replication), Relaxed consistency (Case Study: Dynamo), Distributed agreement (Case Study: Paxos), Web services, Example Case studies: MapReduce, Pig, Distributed GraphLab', 'faculty_elective', TRUE, NOW()),
('02-24-00305', 'Mobile Programming', 3, 'Mobile application development frameworks, Design techniques, Methodologies for mobile application development, Android development w/ Java, iOS development w/ Swift, Using Native React, RESTful and Non-RESTful apps, Creating Web/Cloud services, Mobile sensors, Security and trust management, Privacy and ethics, Usability', 'faculty_elective', TRUE, NOW()),
('02-24-00306', 'Web Programming', 3, 'Web fundamentals, Programming Languages for the Web, HTML Basics, Using HTML, Using CSS and templates, Basics of JavaScript, Programming with JavaScript, Introduction to front end programming, PHP, Django, AngularJS, React, responsive web design, Full stack state management, Security pitfalls and basic solutions', 'faculty_elective', TRUE, NOW()),
('02-24-00307', 'Operating Systems', 3, 'Overview of operating systems, Operating systems principles and structure, Processes and threads, Synchronization, Scheduling, Memory management and virtual memory, I/O device management, File systems, Virtual machines, System performance evaluation, Security and protection, Distributed operating systems, Case studies, Recent trends in operating systems', 'faculty_elective', TRUE, NOW()),
('02-24-00308', 'Computer Networks', 3, 'Introduction to network architecture, layering, and protocols, Principles of network applications and application layer protocols examples, Socket programming, Introduction to transport layer protocols: Principles of reliable data delivery (error control, congestion control, and flow control), TCP protocol, Introduction to the network layer: Network layer addressing, Routing and forwarding, Principles of routing algorithms', 'faculty_elective', TRUE, NOW());


-- University Obligatory Courses (4 credit hours total - 2 courses × 2 credits each)
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-00-00001', 'Critical Thinking', 2, 'This course aims to develop students'' critical thinking skills, including analysis, evaluation, inference, explanation, and self-regulation. Students will learn to identify arguments, evaluate evidence, recognize logical fallacies, and construct well-reasoned arguments.', 'university_obligatory', TRUE, NOW()),
('02-00-00002', 'Innovation & Entrepreneurship', 2, 'This course introduces students to the concepts of innovation and entrepreneurship. Topics include identifying opportunities, developing innovative solutions, business model creation, and understanding the entrepreneurial mindset needed to succeed in today''s dynamic business environment.', 'university_obligatory', TRUE, NOW()),
('02-00-00003', 'Rights of Human and Anti-Corruption', 0, 'This course inform the student what happen in his society and his role aspect its country', 'university_obligatory', TRUE, NOW());


-- University Elective Courses (2 credit hours each - Students select 3 courses = 6 credits)
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-0X-00001', 'Principles of Scientific Research', 2, 'This course introduces students to the fundamental principles and methodologies of scientific research. Topics include research design, literature review, data collection methods, research ethics, and proper citation techniques.', 'university_elective', TRUE, NOW()),
('02-0X-00002', 'Communication Skills', 2, 'This course develops essential communication skills for academic and professional settings. Topics include public speaking, presentation techniques, interpersonal communication, active listening, and professional writing.', 'university_elective', TRUE, NOW()),
('02-0X-00003', 'Professional Ethics', 2, 'This course examines ethical principles and moral issues in professional contexts. Students will explore ethical frameworks, professional codes of conduct, social responsibility, and decision-making in complex ethical situations.', 'university_elective', TRUE, NOW()),
('02-0X-00004', 'History of Science and Technology', 2, 'This course surveys the historical development of science and technology from ancient civilizations to the modern era. Students will explore key scientific discoveries, technological innovations, and their impact on society.', 'university_elective', TRUE, NOW()),
('02-0X-00005', 'Environmental Studies', 2, 'This course provides an overview of environmental science and sustainability issues. Topics include ecosystems, biodiversity, climate change, renewable energy, pollution, and sustainable development practices.', 'university_elective', TRUE, NOW()),
('02-0X-00006', 'Arabic Language and Literature', 2, 'This course enhances students'' proficiency in Arabic language skills including reading, writing, and critical analysis of Arabic literary texts. Emphasis on proper grammar, composition, and appreciation of Arabic literature.', 'university_elective', TRUE, NOW()),
('02-0X-00007', 'Introduction to Psychology', 2, 'This course introduces the fundamental concepts and theories of psychology. Topics include human development, learning and memory, motivation and emotion, personality theories, and social behavior.', 'university_elective', TRUE, NOW()),
('02-0X-00008', 'Economics for Non-Specialists', 2, 'This course provides a basic understanding of economic principles and their application in everyday life. Topics include supply and demand, market structures, basic macroeconomic concepts, and personal finance.', 'university_elective', TRUE, NOW()),
('02-0X-00009', 'Digital Literacy and Internet Safety', 2, 'This course develops essential digital literacy skills for the modern world. Topics include effective use of digital tools, online research techniques, digital citizenship, internet safety, and protecting personal information online.', 'university_elective', TRUE, NOW()),
('02-0X-00010', 'Arts Appreciation', 2, 'This course introduces students to various forms of artistic expression including visual arts, music, theater, and film. Students will develop critical appreciation skills and understanding of the role of arts in society.', 'university_elective', TRUE, NOW());

-- ==============================
-- PROGRAM-SPECIFIC COURSES
-- ==============================

-- ==============================
-- 1. Computing & Data Sciences Program 
-- ==============================

-- Program Compulsory Courses
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-01201', 'Advanced Calculus', 3, 'Sequences, Series, Absolute and conditional convergence, Tests of convergence, Power series and interval of convergence, Taylor''s series, Differentiation and integration of power series, Vector algebra in R2 and R3, Dot product and cross product, Functions of several variables, Limits and continuity, Partial derivatives, Total differentials, Directional derivatives, Gradients of functions, Mean value theorem, Lagrange''s multiplier method, Multiple integrals, Iterated integrals, Change of order of integration, Change of variable formula for multiple integrals', 'program_obligatory', TRUE, NOW()),
('02-24-01202', 'Data Science Methodology', 3, 'The data science framework, Business understanding, RFM modelling, Data collection and preparation, Structured and unstructured data, Cleaning and Exploration, Data visualization, Market basket analysis, Modeling, Evaluation, Feedback, Use cases', 'program_obligatory', TRUE, NOW()),
('02-24-01203', 'Data Science Tools and Software', 3, 'Practical data handling and statistical tools, Applications using Python and R, Predictive data analysis software as SAS and Apache Spark, Other data analytics software tools, Use cases in Finance, Media, and Health', 'program_obligatory', TRUE, NOW()),
('02-24-01204', 'Regression Analysis', 3, 'Simple linear regression, Multiple regression, Model building and regression diagnostics, One and two factor analysis of variance, Analysis of covariance, Linear model as special case of generalized linear model', 'program_obligatory', TRUE, NOW()),
('02-24-01205', 'Field Training I', 2, 'Field training for practical experience in data science', 'program_obligatory', TRUE, NOW()),
('02-24-01301', 'Stochastic Processes', 3, 'Discrete-time Markov chains, Classification of states, Irreducibility, Periodicity, First passage times, Recurrence and transience, Convergence theorems and stationary distributions, Poisson process, Point process, Continuous time Markov chain, Birth and death processes, Martingale, Queuing models, Queuing theory', 'program_obligatory', TRUE, NOW()),
('02-24-01302', 'Design and Analysis of Experiments', 3, 'Basic experimental designs, Analysis of one-way and two-way layout data, Multiple comparisons, Factorial designs, 2k-factorial designs, Blocking and confounding, Fractional factorial design and nested designs, Representation of results', 'program_obligatory', TRUE, NOW()),
('02-24-01303', 'Data Visualization Tools', 3, 'Introduction to Information visualization, Visualization tools, Design approaches for visualization, Statistical graphics for univariate, multivariate, temporal and spatial data, Basic design principles and critical evaluation of visual displays of data, Viewing transformations, Projections, Rendering techniques, Graphical software packages', 'program_obligatory', TRUE, NOW()),
('02-24-01304', 'Data Computation and Analysis', 3, 'Data storage platforms, Data manipulation, Data cleaning, Data analysis, Dimensionality reduction, Numerical methods for machine learning models, Cluster analysis, Principal component analysis, Kernel methods for pattern analysis, Sparse coding and dictionary learning, Recommendation systems', 'program_obligatory', TRUE, NOW()),
('02-24-01305', 'Survey Methodology', 3, 'Planning of surveys, Questionnaire construction, Methods of data collection, Fieldwork procedures, Sources of errors, Basic ideas of sampling, Simple random sampling, Stratified, systematic, replicated, cluster and quota sampling, Sample size determination and cost', 'program_obligatory', TRUE, NOW()),
('02-24-01306', 'Computing Intensive Statistical Methods', 3, 'Empirical distribution, Estimation of population distribution, General algorithm of bootstrap method, Bootstrap estimates of standard deviation and bias, Jack-knife method, Bootstrap confidence intervals, Empirical likelihood for the mean and parameters, Wilks theorem, EM algorithm', 'program_obligatory', TRUE, NOW()),
('02-24-01307', 'Field Training II', 2, 'Advanced field training for practical experience in data science', 'program_obligatory', TRUE, NOW()),
('02-24-01401', 'Big Data Analytics', 3, 'Basics of big data, Big data issues, Big data processing, Streaming big data, Web and social networks data, Classification of big data, Clustering of big data, Modeling big data, Predicting using models, Scaling traditional techniques, Use cases', 'program_obligatory', TRUE, NOW()),
('02-24-01402', 'Introduction to Social Networks', 3, 'Introduction to online social networks computing, Theoretical foundation, Mathematical aspects, and applications of social computing, Impact of social networks, Evolution of social networks, Social influence analysis, Link prediction and analysis', 'program_obligatory', TRUE, NOW()),
('02-24-01403', 'Simulations', 3, 'Pseudorandom number generation, Generating discrete and continuous random variables, Simulating discrete events, Statistical analysis of simulated data, Variance reduction, Markov Chain Monte Carlo methods, Selected topics in stochastic optimization', 'program_obligatory', TRUE, NOW()),
('02-24-01404', 'Project I', 3, 'An opportunity for the student to become closely associated with a professor in a research effort to develop research skills and technique and/or to develop a program of independent in depth study in a subject area in which the professor and the student have a common interest', 'program_obligatory', TRUE, NOW()),
('02-24-01405', 'Social Data Analytics', 3, 'Social data analysis, Influence and centrality in social media, Information diffusion on networks, Topic modeling and sentiment analysis, Identifying social bots, and predicting behavior, Network analysis, Statistical methods for social data analytics, AI techniques for social data analytics', 'program_obligatory', TRUE, NOW()),
('02-24-01406', 'Distributed Data Analysis', 3, 'Introduction to distributed processing, Parallel computing, Distributed processing platforms, Data analysis using distributed processing platforms, Data mining algorithms in parallel, Case studies using parallel R or similar tools', 'program_obligatory', TRUE, NOW()),
('02-24-01407', 'Stream Processing', 3, 'Dealing with big data online, Data streaming, Implications and impacts, Streaming applications, Stream processing frameworks, Stream processing algorithms, Streaming SQL languages, Analytics while streaming', 'program_obligatory', TRUE, NOW()),
('02-24-01408', 'Project II', 3, 'The students continue the study performed in the first semester', 'program_obligatory', TRUE, NOW());

-- Computing & Data Sciences Program Elective Courses
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-01409', 'Convex Optimization', 3, 'Introduction to convex optimization, Basic concepts for convex functions and sub-gradients, Gradient and sub-gradient methods, Accelerated proximal gradient methods, Stochastic block coordinate descent methods, Lagrangian duals, Splitting algorithms and implementations', 'program_elective', TRUE, NOW()),
('02-24-01410', 'Non-Linear and Combinatorial Optimization', 3, 'Optimization techniques for constrained unidimensional and multidimensional problems, Analysis techniques, Matching, Unimodular matrices, Matroids, Polyhedral aspects, Maxflows and min-cuts, Multicommodity flows, Heuristic techniques for hard optimization problems', 'program_elective', TRUE, NOW()),
('02-24-01411', 'Multivariate Statistical Analysis', 3, 'Distribution theory, Multivariate normal distribution, Hotelling''s T2 and Wishart distributions, Inference on the mean and covariance, Principal components and canonical correlation, Factor analysis, Discrimination and classification', 'program_elective', TRUE, NOW()),
('02-24-01412', 'Bayesian Statistics', 3, 'Bayes'' theorem, estimation, hypothesis testing, prior distributions, likelihood, predictive distributions. Bayesian computation: numerical approximation, posterior simulation and integration, Markov chain simulation, models and applications: hierarchical linear models, generalized linear models, multivariate models, mixture models, models for missing data', 'program_elective', TRUE, NOW()),
('02-24-01413', 'Data Compression Techniques', 3, 'Basics of information theory, Basic data compression techniques, Lossless and lossy compression, Huffman coding, LZW coding, Entropy coding, Text compression, Video and audio compression, Succinct data structures, Applications to the compression of real data sets (DNA sequences, biological time series, multimedia streams)', 'program_elective', TRUE, NOW()),
('02-24-01414', 'Concurrent Algorithms and Data Structures', 3, 'Mutual exclusion, Correctness conditions for concurrent datatypes, Foundations of shared memory, Synchronization methods, Implementing locks and monitors, Implementing concurrent datatypes, such as: linked lists, queues, counting and sorting networks, hash tables and skip lists', 'program_elective', TRUE, NOW()),
('02-24-01415', 'Distributed Database Systems', 3, 'Distributed database architectures, Distributed data storage and indexing, Distributed and parallel query processing/optimization, Distributed transaction management, Concurrency control in distributed database systems', 'program_elective', TRUE, NOW()),
('02-24-01416', 'Advanced Database Systems', 3, 'Transaction handling, Advanced and embedded SQL, Triggers and stored procedures, Client and server side applications, Efficient storing, accessing, securing and recovering of data, Advanced structures in relational, hybrid, and object oriented databases', 'program_elective', TRUE, NOW());

-- ==============================
-- 2. Business Analytics Program 
-- ==============================

-- Program Compulsory Courses
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-02201', 'Introduction to Business', 3, 'This course will expose you to business terminology, concepts, and current business practices. It will help students to establish a viable business vocabulary, foster critical and analytical thinking, and refine their business decision-making skills', 'program_obligatory', TRUE, NOW()),
('02-24-02202', 'Accounting as an Information Systems', 3, 'This course focuses on accounting concepts, principles and theory with an emphasis on problems that arise in applying these concepts for external reporting purposes. Specific emphasis is placed on measurement of assets, liabilities, equities and income, as well as disclosure of additional information that may assist users understand the financial reports', 'program_obligatory', TRUE, NOW()),
('02-24-02203', 'System Analysis & Design', 3, 'This course deal with planning the development of information systems through understanding and specifying in detail what a system should do and how the components of the system should be implemented and work together. System analysts solve business problems through analysing the requirements of information systems and designing such systems by applying analysis and design techniques', 'program_obligatory', TRUE, NOW()),
('02-24-02204', 'Financial Planning and Analysis', 3, 'The course covers the concepts of cash flows, fund flow statements and the numerous financial ratios explained through cases and examples', 'program_obligatory', TRUE, NOW()),
('02-24-02301', 'Business Process Modeling and Integration', 3, 'This course will introduce the best-practice industry process modeling standards in order to equip the student with a solid understanding of practical tools and techniques for business processes modeling in preparation of analysis and improvement of business process performance', 'program_obligatory', TRUE, NOW()),
('02-24-02302', 'Quantitative Analysis', 3, 'This course helps the student to quickly learn and review topics related to quantitative decision making in business. Related to the decision-making tools and models used by managers at every stage of product development and distribution', 'program_obligatory', TRUE, NOW()),
('02-24-02303', 'Data Warehousing & Business Intelligence', 3, 'This course will allow student to learn in a very simple way how to identify, design and develop analytical information systems, such as Business Intelligence with a descriptive analysis on data warehouses', 'program_obligatory', TRUE, NOW()),
('02-24-02304', 'Data Visualization', 3, 'This course helps students to learn how to design and create data visualizations based on data available and tasks to be achieved. This process includes data modeling, data processing (such as aggregation and filtering), mapping data attributes to graphical attributes, and strategic visual encoding based on known properties of visual perception as well as the task(s) at hand', 'program_obligatory', TRUE, NOW()),
('02-24-02305', 'Enterprise Information Systems', 3, 'This course aims to provide students with solid understanding of IT role at the enterprise. It is viewed as a combination of business management practice and technology', 'program_obligatory', TRUE, NOW()),
('02-24-02306', 'Data Driven Marketing', 3, 'This course focus on helping students define strategies and tactics to distil actionable insights from the data they have available and applying them to their marketing', 'program_obligatory', TRUE, NOW()),
('02-24-02401', 'Leadership and People Analytics', 3, 'This course is an introduction to the theory of people analytics, and is not intended to prepare learners to perform complex talent management data analysis. People analytics is a data-driven approach to managing people at work', 'program_obligatory', TRUE, NOW()),
('02-24-02402', 'Data and IT Governance', 3, 'This course provides understanding of the IT Governance, its characteristics, and importance. Understand IT Governance elements and domains. And the IT Governance Frameworks', 'program_obligatory', TRUE, NOW()),
('02-24-02403', 'Information Retrieval', 3, 'This course introduces standard concepts in information retrieval such as documents, queries, collections, and relevance. It also covers the tasks of indexing, searching, and recalling data, particularly text or other unstructured forms', 'program_obligatory', TRUE, NOW()),
('02-24-02404', 'Project I', 3, 'An opportunity for the student to become closely associated with a professor in a research effort to develop research skills and technique and/or to develop a program of independent in depth study in a subject area in which the professor and the student have a common interest', 'program_obligatory', TRUE, NOW()),
('02-24-02405', 'Text and Social Media Mining', 3, 'This course will cover the major techniques for mining and analyzing text data in social media to discover interesting patterns, extract useful knowledge, and support decision making, that can be generally applied to text data in any natural language with no or minimum human effort', 'program_obligatory', TRUE, NOW()),
('02-24-02406', 'Logistics and Supply Chain Analytics', 3, 'This course Learn fundamental concepts and the foundational skills for logistics and supply chain management from both analytical and practical perspectives', 'program_obligatory', TRUE, NOW()),
('02-24-02407', 'Information Technology Laws and Ethics', 3, 'This course focuses on the regulatory framework that governs information technology within international and domestic settings. Also focuses on legal and regulatory aspects of the Internet and related technologies', 'program_obligatory', TRUE, NOW()),
('02-24-02408', 'Project II', 3, 'The students continue the study performed in the first semester', 'program_obligatory', TRUE, NOW());

-- Business Analytics Program Elective Courses
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-02409', 'Human Computer Interaction', 3, 'This course is an introductory course on human-computer interaction, covering the principles, techniques, and open areas of development in HCI. It provides a business-oriented approach to Human Computer Interaction (HCI)', 'program_elective', TRUE, NOW()),
('02-24-02410', 'Gamification and Games Development', 3, 'In this course students will learn the basics of Gamification with a highly practical approach. They will especially focus on how to design gamified experiences in real life and gain knowledge in areas such as: game design, management, or education', 'program_elective', TRUE, NOW()),
('02-24-02411', 'Technology Trends and Innovation', 3, 'This course Looks at technology and innovation from the perspective of a chief information officer (CIO). Learn about cybersecurity and risk management, IT investments, and vendor management', 'program_elective', TRUE, NOW()),
('02-24-02412', 'GIS and Spatial Data Mining', 3, 'This course constitutes an introduction to GIS and require no prior knowledge. By following this introduction to GIS you will quickly acquire the basic knowledge required to create spatial databases and identify trends and patterns in data so that users can extract hidden predictive information', 'program_elective', TRUE, NOW()),
('02-24-02413', 'Managing Technology Projects', 3, 'This course addresses project management in the context of IT projects, including software projects. It covers detailed topics of the basic concepts of IT project management, including initiating, planning, controlling, executing, and closing projects', 'program_elective', TRUE, NOW()),
('02-24-02414', 'Smart Cities and E-Government', 3, 'This course provides students with the foundational elements of a smart city and to address the breadth of systems that comprise it as well as the Concepts, Methods and model of e-Governance', 'program_elective', TRUE, NOW()),
('02-24-02415', 'Digital Transformation and Digital Economics', 3, 'This course helps students to get knowledge on how Internet, sharing economy, social networks, Big Data and mobile communications change global businesses and how to create value for humans and enterprises in the digital society', 'program_elective', TRUE, NOW()),
('02-24-02416', 'Manufacturing Analytics', 3, 'This course helps students to analyze big data to see what''s important and take action when it matters. It introduces the power of internet of things in manufacturing and emphasizes the importance of Analytics to power the Internet of Things for a Connected Factory', 'program_elective', TRUE, NOW()),
('02-24-02417', 'Predictive Analytics', 3, 'This course introduces students to the statistical techniques that extend the ideas of regression analysis and how to build models for predicting categorical responses', 'program_elective', TRUE, NOW()),
('02-24-02418', 'NLP and Semantic Analysis', 3, 'This course is designed to give an introduction to the algorithms, techniques and software used in natural language processing (NLP). Their use will be illustrated by reference to existing applications, particularly speech understanding, information retrieval, machine translation and information extraction', 'program_elective', TRUE, NOW());

-- ==============================
-- 3. Intelligent Systems Program 
-- ==============================

-- Program Compulsory Courses
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-03201', 'Smart Systems and Computational Intelligence', 3, 'Intelligent systems and evolutionary algorithms, Computational intelligence, Intelligent behavior and nature-inspired algorithms: Genetic algorithms, Swarm Intelligence and Colony optimization, Fuzzy logic: memberships, Reasoning, Fuzzy controllers, Neuro-Fuzzy networks', 'program_obligatory', TRUE, NOW()),
('02-24-03202', 'Operations Research', 3, 'Modeling techniques, Linear and integer programming, Introduction to non-linear optimization, Decision theory, Game theory, Queuing models, Markov chains', 'program_obligatory', TRUE, NOW()),
('02-24-03203', 'Pattern Recognition', 3, 'Introduction to pattern recognition, Representation of features in multidimensional space as random vectors, Similarity and dissimilarity measures in feature space, Bayesian decision theory, Estimation and learning, Feature extraction and selection, Introduction to syntactic pattern recognition, Selected applications', 'program_obligatory', TRUE, NOW()),
('02-24-03204', 'Neural Networks', 3, 'Fundamentals of neural networks, Shallow neural networks, Fuzzy neural networks, Activation functions, Gradient descent, Forward and backpropagation, Vectorization', 'program_obligatory', TRUE, NOW()),
('02-24-03301', 'Intelligent Programming', 3, 'Practical applications of AI techniques in Functional (Common LISP and/or Scheme) and Logic (Prolog) programming languages. Students gain practical experience through programming assignments and projects', 'program_obligatory', TRUE, NOW()),
('02-24-03302', 'Deep Learning', 3, 'Auto-encoders, Convolutional neural networks, Recurrent neural networks (Hopfield - Boltzmann), Deep Neural Networks, Generative adversarial networks, Deep reinforcement learning, Tuning, Regularization, Applications', 'program_obligatory', TRUE, NOW()),
('02-24-03303', 'Modern Control Systems', 3, 'Introduction to discrete-time and digital systems, Sampling, Analysis and design of discrete-time systems, State variable approach, Stability, Controllability, Observability, Pole placement, Observers, Introduction to optimal control, Introduction to Intelligent control systems, Current trends in control, Introduction to Industrial control systems', 'program_obligatory', TRUE, NOW()),
('02-24-03304', 'Embedded Systems', 3, 'Introduction to computer architecture, Sensors, Actuators, Input-Output (I/O) modeling, I/O Interfacing, Microcontrollers, Real-time operating systems, Energy-aware design, Case studies and applications of embedded control systems, Recent trends and developments', 'program_obligatory', TRUE, NOW()),
('02-24-03305', 'Computer Vision', 3, 'Image formation, Image filtering, Boundary detection, Hough transform, Local invariant features, Image segmentation, Object recognition, Camera calibration, Stereovision, Motion, Object detection, Applications', 'program_obligatory', TRUE, NOW()),
('02-24-03306', 'AI Security Issues', 3, 'Cybersecurity fundamentals, Effect of AI on cybersecurity issues, Trapdoors and malicious attacks for AI systems, Smart attacks by AI means', 'program_obligatory', TRUE, NOW()),
('02-24-03401', 'AI Platforms', 3, 'Flow graphs, Dynamic computational graphs, AI platforms (Microsoft Azure Machine Learning, Google Cloud Prediction API), Frameworks: TensorFlow, PyTorch', 'program_obligatory', TRUE, NOW()),
('02-24-03402', 'Internet of Things I', 3, 'Fundamentals of the Internet of Things (IoT), Impact of IoT on society, Business process in IoT, the design and implementation of IoT devices as embedded systems, Hardware and software components for IoT, IoT node authentication, Developing smart cities, IoT security', 'program_obligatory', TRUE, NOW()),
('02-24-03403', 'Natural Language Processing', 3, 'Overview, Representation, Question answering, Summarization, Machine translation, Text classification, Word embedding, Language modeling and sequence tagging, Vector space models of semantics, Sequence to sequence tasks, Applications', 'program_obligatory', TRUE, NOW()),
('02-24-03404', 'Project I', 3, 'An opportunity for the student to become closely associated with a professor in a research effort to develop research skills and technique and/or to develop a program of independent in depth study in a subject area in which the professor and the student have a common interest', 'program_obligatory', TRUE, NOW()),
('02-24-03405', 'Reinforcement Learning', 3, 'Introduction to reinforcement learning, planning by dynamic programming, Markov decision process, Model-free prediction, Model-free control, Value function approximation, Policy gradient methods, Integrating learning and planning, Exploration and Exploitation, Case study: RL in classic games', 'program_obligatory', TRUE, NOW()),
('02-24-03406', 'AI for Robotics', 3, 'Foundations and principles of robotic kinematics, Transformations, Forward kinematics, Inverse kinematics, Differential kinematics (Jacobians), Manipulability and basic equations of motion, Programming on robot arms, Applications, localization and mapping, Kalman filters', 'program_obligatory', TRUE, NOW()),
('02-24-03407', 'Visual Recognition', 3, 'End-to-end models, Image classification, Localization and detection, Implementation, Training and debugging, Long/short term memory, Image captioning using deep learning', 'program_obligatory', TRUE, NOW()),
('02-24-03408', 'Project II', 3, 'The students continue the study performed in the first semester', 'program_obligatory', TRUE, NOW());

-- Intelligent Systems Program Elective Courses
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-03409', 'Speech Recognition', 3, 'Fundamentals of speech signals, Speech analysis, Acoustic phonetics, Noisy channel model, Hidden Markov model, Viterbi algorithm, Word error rate, Advanced decoding, Finite state transducers, GMM acoustic modeling and feature extraction, Neural network acoustic models, End-to-end neural network recognition, Environmental robustness, Applications', 'program_elective', TRUE, NOW()),
('02-24-03410', 'Natural Language Understanding', 3, 'Lexical semantics, Distributed representations of meaning, Relation extraction, Semantic Parsing, Sentiment analysis, Dialogue agents', 'program_elective', TRUE, NOW()),
('02-24-03411', 'Embedded Machine Learning', 3, 'Small footprint modes, Model compression and pruning, Sensors and sensor data properties, Wearable devices, Medical fitness and security applications, IoT applications', 'program_elective', TRUE, NOW()),
('02-24-03412', 'Intelligence Technology Trends', 3, 'New trends in Intelligence technology', 'program_elective', TRUE, NOW()),
('02-24-03413', 'Internet of Things II', 3, 'Big data platforms for the IoT, Interoperability problem in the IoT context, Sustainability data and analytics in cloud-based M2M systems, MCC Edge Computing technology, Role of IoT in intelligent transportation systems, Wi-Fi and Bluetooth technology', 'program_elective', TRUE, NOW()),
('02-24-03414', 'Knowledge-Base AI', 3, 'Introduction to knowledge-based AI and cognitive systems, Semantic networks, Generate & Test, Means-ends analysis, Problem reduction, Production systems, Common-sense reasoning, Learning: Learning by recording cases, Incremental concept learning, Classification, Version spaces & discrimination trees, Analogical reasoning: Case-based reasoning, Explanation-based learning, Analogical reasoning, Visuospatial reasoning: Constraint propagation, Visuospatial reasoning', 'program_elective', TRUE, NOW()),
('02-24-03415', 'Virtual Reality', 3, 'Virtual Reality (VR) covers the architecture and design of current generation systems for creating 3D VR environments, Application/hardware architecture, Pipeline development, Geometric transformations in a 3D coordinate system, Geometry and pixel shading, Lighting systems, Texturing and VR development', 'program_elective', TRUE, NOW()),
('02-24-03416', 'Game Theory', 3, 'Introduction, The normal form, Payoffs, Strategies, Dominant strategies, Pure and mixed strategy Nash equilibria, Iterative removal of strictly dominated strategies, Mini-max strategies and the mini-max theorem for a zero-sum game, Correlated equilibria, Introduction to imperfect-information games, Mixed versus behavioral strategies', 'program_elective', TRUE, NOW());

-- ==============================
-- 4. Media Analytics Program 
-- ==============================

-- Program Compulsory Courses
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-04201', 'Data Driven Journalism', 3, 'This course is about using numbers to tell the best story possible. The course will introduce reporters to the practice of data journalism in a busy newsroom, showcasing the importance of telling a story and how tools can help you do it', 'program_obligatory', TRUE, NOW()),
('02-24-04202', 'Digital Mass Communication', 3, 'This course surveys the basic factors affecting mass communication in the digital age, including: theories and models of communication, the relationship between mass media and society, technology, and trends in newspapers, radio, television, film, books, the Internet advertising, public relations, visual messages, media law, and ethics in cyberspace', 'program_obligatory', TRUE, NOW()),
('02-24-04203', 'Digital Video Production', 3, 'This course will allow students to develop professional skills in video, film, and television pre-production, production, and post-production. Fundamentals of video production, including the techniques and the aesthetics of shooting, lighting, and editing will be covered', 'program_obligatory', TRUE, NOW()),
('02-24-04204', 'News Editing and Blogging', 3, 'This course provides intensive training in the editing and preparation of newspaper copy, and the writing of headlines and page layout using computerized layout software', 'program_obligatory', TRUE, NOW()),
('02-24-04301', 'Image Processing', 3, 'This course focuses on the theory and algorithms underlying a range of tasks including acquisition and formation, enhancement, segmentation, and representation. The course covers topics including image enhancement, high-dimensional spectral analysis, spatial and frequency domain linear image filtering, nonlinear image filtering, binary image processing, edge detection, image segmentation, feature extraction, and the basics of digital video processing', 'program_obligatory', TRUE, NOW()),
('02-24-04302', 'Web Design and Search-Engine Optimization', 3, 'This course will teach you to optimize website content for the best possible search engine ranking. You''ll learn the theory behind Google search and other search engine algorithms; you''ll also build practical, real-world skills that you can apply to a career in digital marketing or online content development', 'program_obligatory', TRUE, NOW()),
('02-24-04303', 'Computer Audio', 3, 'This course objective is to provide computer programmers with a thorough understanding of sound and music - and of the digital representation of those phenomena - that will help them to program more effectively for sound and music applications', 'program_obligatory', TRUE, NOW()),
('02-24-04304', 'Infographics and Data Visualization', 3, 'This course introduces the principles of the visual representation of information. It consists of a deep study of information graphics and digital visualizations and the use of charts, maps, diagrams and illustrations to tell stories', 'program_obligatory', TRUE, NOW()),
('02-24-04305', 'Natural Language Processing', 3, 'The intent of the course is to present a fairly broad introduction to Natural Language Processing (NLP, a.k.a. computational linguistics), the study of computing systems that can process, understand, or communicate in human language', 'program_obligatory', TRUE, NOW()),
('02-24-04306', 'Media Processing', 3, 'This course teaches the fundamentals of media representation, storage, communication, and processing by digital means, with an emphasis on audio, still images, and video media. It includes an introduction to sampling theory and various representation techniques', 'program_obligatory', TRUE, NOW()),
('02-24-04401', 'Computer Graphics', 3, 'This course is a study of the hardware and software principles of interactive raster graphics. Topics include an introduction to the basic concepts, 2-D and 3-D modeling and transformations, viewing transformations, projections, rendering techniques, graphical software packages and graphics systems', 'program_obligatory', TRUE, NOW()),
('02-24-04402', 'Digital Broadcasting', 3, 'This course is designed to provide students with groundwork in various forms of media, including writing, videography, broadcasting, or public speaking. The course covers also digital television broadcasting systems, transmission of DTV signals via satellite, on cable and via terrestrial networks', 'program_obligatory', TRUE, NOW()),
('02-24-04403', 'Audience Research and Analysis', 3, 'This course study how specific audiences perceive and process the media. Application to varied cultural products: films, television programs, advertising. Lectures will explore selected approaches to audience research with particular attention paid to digital contexts and virtual audiences', 'program_obligatory', TRUE, NOW()),
('02-24-04404', 'Project I', 3, 'An opportunity for the student to become closely associated with a professor in a research effort to develop research skills and technique and/or to develop a program of independent in depth study in a subject area in which the professor and the student have a common interest', 'program_obligatory', TRUE, NOW()),
('02-24-04405', 'Social Media Analytics', 3, 'This course provides learners with the foundational skills of social media listening including the creation of monitors and common social media metrics. Learners will be exposed to both the benefits and limitations of relying on social media data, methods of gathering data, methods in identifying trends in social data, and the theory of social networks', 'program_obligatory', TRUE, NOW()),
('02-24-04406', 'Multimedia Analytics', 3, 'This course covers recent contributions in content-based indexing and retrieval, automatic or interactive multimedia data annotation, large-scale image analysis, video semantic search engines, video synopsis', 'program_obligatory', TRUE, NOW()),
('02-24-04407', 'Public Opinion and E Surveys', 3, 'This course examines public opinion Politics and how to measure it. The course considers the nature of public opinion, survey methods, the role of polling in opinion expression, opinion formation, citizen knowledge, the role of media in shaping opinion, the effect of opinion on policy, and political polarization', 'program_obligatory', TRUE, NOW()),
('02-24-04408', 'Project II', 3, 'The students continue the study performed in the first semester', 'program_obligatory', TRUE, NOW());

-- Media Analytics Program Elective Courses
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-04409', 'Interactive Media', 3, 'This course examines the history, aesthetics, and cultural implications of interactivity through media. Pursuing a spectrum of interactive avenues- cinematic, literary, artistic, virtual, ludic, communicative- we will consider the ways in which media work to mobilize creativity and extend individual and collective agency', 'program_elective', TRUE, NOW()),
('02-24-04410', 'Online Journalism', 3, 'This course focuses on the use of multimedia tools such as computers, internet, digital audio recorders, video recorders, cameras and GSM phones to tell stories and their effects on journalism''s role in society', 'program_elective', TRUE, NOW()),
('02-24-04411', 'Computational Photography', 3, 'This course is concerned with overcoming the limitations of traditional photography with computation: in optics, sensors, and geometry; and even in composition, style, and human interfaces', 'program_elective', TRUE, NOW()),
('02-24-04412', 'Computer Animations', 3, 'This course is designed to provide students with an opportunity to continue building up their portfolio of digital work by focusing on the further study and exploration of computer animation', 'program_elective', TRUE, NOW()),
('02-24-04413', 'Video Game Design and Programming', 3, 'This course provides students with the opportunity to design, program, and create fully functional video games. The course will introduce basic programming and design skills that are essential to developing a video game', 'program_elective', TRUE, NOW()),
('02-24-04414', 'Virtual Reality', 3, 'Virtual Reality (VR) covers the architecture and design of current generation systems for creating 3D VR environments. Topics included are application/hardware architecture, pipeline development, geometrical transformations in a 3D coordinate system, geometry and pixel shading, lighting systems, texturing and VR development', 'program_elective', TRUE, NOW()),
('02-24-04415', 'Digital Media Forensics', 3, 'This course provides a sound educational foundation for the performance of professional activities within the digital forensics discipline which will enable students to: (1) develop a knowledge base about computer crime, digital evidence and technological investigations; (2) adopt a set of professional values; and (3) develop skills related to best practices in the field of digital forensics', 'program_elective', TRUE, NOW());

-- ==============================
-- 5. Healthcare Informatics and Data Analytics Program 
-- ==============================

-- Program Compulsory Courses
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-05201', 'Introduction to Epidemiology', 3, 'This course provides students with an understanding of the basic concepts, principles, and methods of epidemiology as applied to studies of both infectious and chronic diseases. It is also concerned with critical thinking, analytic skills, and application to clinical practice and research', 'program_obligatory', TRUE, NOW()),
('02-24-05202', 'Anatomy & Physiology', 3, 'This course provides students with the structure and function of the human body. Topics covered will include the basic organization of the body and major body systems, common anatomical terminology and the basic physiological processes of each system', 'program_obligatory', TRUE, NOW()),
('02-24-05203', 'Pharmacology and Chemistry of Drugs', 3, 'The course is concerned with studying different pharmacological classes of drugs, their simple mechanisms of action. It also focuses on the molecular aspects that guide medicinal chemistry and the design and development of novel drugs', 'program_obligatory', TRUE, NOW()),
('02-24-05204', 'Ethics & Regulations in Healthcare', 3, 'This course provides students with a foundation of health law and ethics and reviews a wide variety of health care legal and ethical situations and dilemmas. The goals are to provide students with practical knowledge of health laws and ethics and their application in the real world of health care', 'program_obligatory', TRUE, NOW()),
('02-24-05205', 'Field Training I', 2, 'Field training for practical experience in healthcare informatics', 'program_obligatory', TRUE, NOW()),
('02-24-05301', 'Neuroscience and Robotics', 3, 'This course introduces students to robotics from a computational perspective based on understanding higher functions of the human brain, with the integration of neuroscience, and robotics', 'program_obligatory', TRUE, NOW()),
('02-24-05302', 'Health Information Systems', 3, 'This course covers concepts and techniques for managing and maintaining manual and electronic health records. Topics include structure and use of health information including data collection and analysis, data sources/sets, archival systems, and quality and integrity of healthcare data', 'program_obligatory', TRUE, NOW()),
('02-24-05303', 'Computer-Assisted Drug Design', 3, 'This course covers the structure and target-based design, molecular modelling, quantum mechanics, drug likeness properties, QSAR and pharmacokinetic and dynamics using several software that are freely available', 'program_obligatory', TRUE, NOW()),
('02-24-05304', 'National and International Healthcare Systems', 3, 'The course aims to introduce the principles of health care organization and policy in a comparative perspective nationally and internationally, identify the key characteristics and components of health care systems, assess each health care system''s strengths and weaknesses, and discuss the recent health care reform efforts', 'program_obligatory', TRUE, NOW()),
('02-24-05305', 'Health Policy & Economics', 3, 'This course introduces students to the application of microeconomic principles to the study of individual health production & health insurance, the analysis of the health-care industry, and the evaluation of health policy', 'program_obligatory', TRUE, NOW()),
('02-24-05306', 'Healthcare Market Analytics', 3, 'The course investigates the role that marketing plays in the strategic management of health care organizations and identify and address marketing opportunities and problems using a variety of tools and strategies', 'program_obligatory', TRUE, NOW()),
('02-24-05307', 'Field Training II', 2, 'Advanced field training for practical experience in healthcare informatics', 'program_obligatory', TRUE, NOW()),
('02-24-05401', 'E-health, Telehealth and Telemedicine', 3, 'This course provides students with an orientation to technology-based health promotion; introduces definitions and concepts relating to the use of telehealth in clinical and non-clinical health services. A range of clinical and non-clinical telehealth applications will be explored using case examples, while introducing relevant guidelines and technical standards', 'program_obligatory', TRUE, NOW()),
('02-24-05402', 'Mathematical Modelling for Health', 3, 'This course covers the uses of different types of models to simulate health events, health outcomes and scenarios. The use of models will be applied to predictive modelling, simulation and decision analysis in various areas of medical care including preventive medicine, clinical practice and public health', 'program_obligatory', TRUE, NOW()),
('02-24-05403', 'Clinical & Medical Care Delivery', 3, 'This course gives an outline of the healthcare delivery process and operating procedures at primary, secondary and tertiary levels to provide a clear vision for students on the healthcare environment in which they are expected to operate and apply their informatics and analytics knowledge', 'program_obligatory', TRUE, NOW()),
('02-24-05404', 'Project I', 3, 'This course is based around a group project that should apply the acquired learning and skills to the design, development, creation, use and maintenance of information systems for healthcare', 'program_obligatory', TRUE, NOW()),
('02-24-05405', 'Computerized Disease Registries', 3, 'This course provides students with an overview of the function and use of computerized disease registries and outlines issues for consideration in obtaining registry software and integrating registry products into the routine work of the physician practice', 'program_obligatory', TRUE, NOW()),
('02-24-05406', 'Clinical Decision Support Systems', 3, 'This course provides an overview of the background of Clinical Decision Support Systems (CDSS). Topics include: the design principles behind clinical decision support systems, mathematical foundations of the knowledge-based systems and pattern recognition systems, clinical vocabularies, legal and ethical issues, patient centered clinical decision support systems, and the applications of clinical decision support systems in clinical practice', 'program_obligatory', TRUE, NOW()),
('02-24-05407', 'Health Psychology', 3, 'This course examines the relationships of social, biological, behavioural and cognitive variables to health. It covers those aspects of the social environment that influence health and illness outcomes including the interactions amongst family members and between healthcare consumers and healthcare providers', 'program_obligatory', TRUE, NOW()),
('02-24-05408', 'Project II', 3, 'This course will focus on analytics of healthcare applications where the student should present a project that demonstrates their readiness for the job market in healthcare informatics', 'program_obligatory', TRUE, NOW());

-- Healthcare Informatics Program Elective Courses
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-05409', 'Radiation Physics', 3, 'This course covers basic principles of radiation physics: radioactivity, the physics of ionizing radiation, radiation dosimetry, imaging equipment, radiation therapy equipment and radiation detectors. The course will include lectures and demonstrations of clinical equipment applications', 'program_elective', TRUE, NOW()),
('02-24-05410', 'Cellular & Molecular Biology', 3, 'This course covers the mechanisms with which cells execute fundamental behaviors. Topics include signal transduction, cell cycle progression, cell growth, cell death, cancer biology, cytoskeletal polymers and motors, cell motility, and cell polarity', 'program_elective', TRUE, NOW()),
('02-24-05411', 'Radiation Biology', 3, 'This course covers basic principles of radiation biology: factors that modify radiation response; linear energy transfer; relative biological effectiveness; tissue radiosensitivity; time-dose and fractionation; radiological modelling', 'program_elective', TRUE, NOW()),
('02-24-05412', 'Pathophysiology & Lab Data', 3, 'This course is designed to give the student a clear view of the health and disease process and the results of laboratory investigations and laboratory equipment function to allow the student to assimilate this information into informatics applications', 'program_elective', TRUE, NOW()),
('02-24-05413', 'Principles of Biochemistry', 3, 'This course will give the student a basic idea of the chemical processes of the body metabolism and how they reflect on health and disease. This information will be geared towards providing the students with a first stepping stone to understanding bioinformatics applications and interpretation', 'program_elective', TRUE, NOW());

-- ==============================
-- 6. Cybersecurity Program 
-- ==============================

-- Program Compulsory Courses
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-06201', 'Introduction to Cybersecurity', 3, 'Introduction to information security, need for security, Legal, ethical, and professional issues in information security, Risk management, Planning for security, Security technologies, and Wireless security technologies, Overview of Cryptography, Security and personnel information security maintenance', 'program_obligatory', TRUE, NOW()),
('02-24-06202', 'Number Theory', 3, 'Primes, Divisibility and the fundamental theorem of arithmetic greatest common divisor (GCD), Euclidean algorithm congruences, Chinese remainder theorem, Hensel''s lemma, Primitive roots, Quadratic residues and reciprocity arithmetic functions, Diophantine equations, Continued fractions', 'program_obligatory', TRUE, NOW()),
('02-24-06203', 'Cryptography', 3, 'Introduction to cryptography, Encryption/decryption, Sender authentication, Data integrity, non-repudiation, Attack classification (cipher text-only, known plaintext, chosen plaintext, chosen cipher text), Computational security, Symmetric Ciphers, Asymmetric Ciphers, Key management, Message integrity, Digital Signatures, Digital rights management, and Zero-knowledge protocols', 'program_obligatory', TRUE, NOW()),
('02-24-06302', 'Operating Systems Security', 3, 'Introduction to Operating Systems Security, File system security, Access control mechanisms, memory protections, Interprocess communication vulnerabilities, User and kernel mode securities, Hardware mechanisms, Virtualization, Mobile operating system security', 'program_obligatory', TRUE, NOW()),
('02-24-06303', 'Secure Software Development', 3, 'Fundamental design principles including least privilege, open design, and abstraction, Security specification requirements and their role in design, Implementation issues, Static and dynamic testing, Configuring and patching, and Development and testing ethics', 'program_obligatory', TRUE, NOW()),
('02-24-06304', 'Computer and Network Security', 3, 'Introduction to Computer and Network Security, exploits and defences, Web security issues and defense mechanisms, Network protocols security issues and defense tools, Privacy preserving protocols, Data link layer security, Security of mobile platforms', 'program_obligatory', TRUE, NOW()),
('02-24-06305', 'Data Integrity and Authentication', 3, 'Concepts of authentication and authorization, Authentication techniques and their strengths and weaknesses, Password attack techniques, Password storage techniques, Data leak prevention techniques, Access control techniques and security of data centers', 'program_obligatory', TRUE, NOW()),
('02-24-06306', 'Information Security Management', 3, 'Overview of current information security management standards and practices, Basic micro and macro theory of information security, Introduction to risk, Threat and vulnerability modelling, Overview of security planning and incident management, Legal and ethical aspects of information and privacy management', 'program_obligatory', TRUE, NOW()),
('02-24-06401', 'Social Networks Computing', 3, 'Introduction to online social networks computing, Theoretical foundation, Mathematical aspects, and applications of social computing, Network structure, Community structure, Social influence analysis, Link prediction and analysis, Privacy and security in social networks', 'program_obligatory', TRUE, NOW()),
('02-24-06402', 'Security of Distributed Systems', 3, 'Threats of distributed systems, Protection mechanisms against distributed systems attacks, Foundation for designing and developing secure distributed systems, Evaluating the security of existing solutions, Standards, Security protocols, Technologies, and cryptographic mechanisms for securing modern distributed systems, Common mistakes leading to insecurities in distributed systems', 'program_obligatory', TRUE, NOW()),
('02-24-06403', 'Human Security', 3, 'Identification and authentication of people and devices, Identity management, Types of social engineering attacks, Detection and mitigation of social engineering attacks, Awareness and understanding, Social behavioral privacy and security, and Personal data privacy and security', 'program_obligatory', TRUE, NOW()),
('02-24-06404', 'Project I', 3, 'An opportunity for the student to become closely associated with a professor in a research effort to develop research skills and technique and/or to develop a program of independent in-depth study in a subject area in which the professor and the student have a common interest', 'program_obligatory', TRUE, NOW()),
('02-24-06405', 'Cybersecurity Risk Management', 3, 'Principles of risk management and its three key elements: risk analysis, risk assessment and risk mitigation. Risk level of security related threats and vulnerabilities, Cost-benefit analysis and business impact analysis, Qualitative and quantitative frameworks for assessing information security risk, Quantitative framework with data mining and machine learning approaches, Data-driven risk analytics, Intersection of information security, big data and artificial intelligence, Case studies', 'program_obligatory', TRUE, NOW()),
('02-24-06406', 'Digital Forensics', 3, 'Introduction to digital forensics, Limits and types of tools of digital forensics, Investigatory process, Acquisition and preservation of evidence, Evidence analysis techniques, Presentation of results, Authentication of evidence, Mobile forensics', 'program_obligatory', TRUE, NOW()),
('02-24-06407', 'Law and Cybersecurity', 3, 'Data security law, Legal aspects of software development, Sensitive personal data, Human security factors, Privacy laws, Ethics and compliance, Cross borders privacy and data security laws', 'program_obligatory', TRUE, NOW()),
('02-24-06408', 'Project II', 3, 'The students continue the study performed in the first semester', 'program_obligatory', TRUE, NOW());

-- Cybersecurity Program Elective Courses
INSERT INTO courses (course_code, course_name_en, credit_hours, description, course_type, is_active, created_at) VALUES
('02-24-06409', 'AI Security Issues', 3, 'Cybersecurity fundamentals, Effect of AI on cybersecurity issues, Trapdoors and malicious attacks for AI systems, Smart attacks by AI means', 'program_elective', TRUE, NOW()),
('02-24-06410', 'Proactive Computer Security', 3, 'Information sharing and threat intelligence, Penetration testing methodology, Common penetration testing Tools, Proactive computer security management', 'program_elective', TRUE, NOW()),
('02-24-06411', 'Software Security Engineering', 3, 'Introduction to software security engineering, SQL injection, cross-site scripting, Request forgery, Clickjacking, Threat modeling, Session management, Authentication and identity, Security models', 'program_elective', TRUE, NOW()),
('02-24-06412', 'Blockchain and Security of Blockchain', 3, 'Introduction to blockchains and cryptocurrencies, Distributed ledger technologies, Trust and vulnerabilities, Consensus mechanisms, Basics of contract law, Smart contracts, Regulations and laws of blockchains, Security of blockchains', 'program_elective', TRUE, NOW()),
('02-24-06413', 'Cloud Computing Security', 3, 'Introduction to cloud computing security, Virtualization security related issues and threats, Access control, Identity management, Denial of service, Account and service hijacking, Secure APIs, Forensics, Regulatory compliance, Trustworthy computing, Secure computation', 'program_elective', TRUE, NOW()),
('02-24-06414', 'Social Networks Analytics', 3, 'Social data analysis, influence and centrality in social media, information diffusion on networks, topic modeling and sentiment analysis, identifying social bots, and predicting behavior, Network analysis, Statistical methods for social data analytics, AI techniques for social data analytics, Advanced security and privacy issues in social networks', 'program_elective', TRUE, NOW()),
('02-24-06415', 'Internet of Things', 3, 'Fundamentals of the Internet of Things (IoT), Standards and Protocols of IoT, Impact of IoT on society, IoT node authentication, IoT security platforms', 'program_elective', TRUE, NOW()),
('02-24-06416', 'Mobile Computing', 3, 'Introduction to mobile computing, Mobile technologies and architecture, Wireless communication technologies, Mobile application development technologies and challenges, Application environment, Mobile user interfacing and interaction, Mobile sensors and sensors programming, Distributed computing issues, Security issues', 'program_elective', TRUE, NOW());





-- ==============================
-- INSERT COURSE PREREQUISITES
-- ==============================

-- Faculty Compulsory Course Prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00108' AND p.course_code = '02-24-00105';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00109' AND p.course_code = '02-24-00103';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00110' AND p.course_code = '02-24-00105';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00201' AND p.course_code = '02-24-00106';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00202' AND p.course_code = '02-24-00108';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00203' AND p.course_code = '02-24-00101';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00204' AND p.course_code = '02-24-00108';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00205' AND p.course_code = '02-24-00109';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00206' AND p.course_code = '02-24-00201';

-- Faculty Elective Course Prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00301' AND p.course_code = '02-24-00110';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00303' AND p.course_code = '02-24-00108';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00304' AND p.course_code = '02-24-00103';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00304' AND p.course_code = '02-24-00108';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00305' AND p.course_code = '02-24-00105';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00306' AND p.course_code = '02-24-00105';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00307' AND p.course_code = '02-24-00103';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00307' AND p.course_code = '02-24-00105';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00308' AND p.course_code = '02-24-00103';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00308' AND p.course_code = '02-24-00105';

-- ==============================
-- Computing & Data Sciences Program Prerequisites
-- ==============================
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01201' AND p.course_code = '02-24-00102';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01202' AND p.course_code = '02-24-00104';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01203' AND p.course_code = '02-24-00105';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01203' AND p.course_code = '02-24-00201';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01203' AND p.course_code = '02-24-01202';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01204' AND p.course_code = '02-24-00201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01301' AND p.course_code = '02-24-00101';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01301' AND p.course_code = '02-24-00201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01302' AND p.course_code = '02-24-00201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01303' AND p.course_code = '02-24-01202';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01303' AND p.course_code = '02-24-01203';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01304' AND p.course_code = '02-24-00205';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01304' AND p.course_code = '02-24-00206';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01305' AND p.course_code = '02-24-00201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01306' AND p.course_code = '02-24-00201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01401' AND p.course_code = '02-24-00105';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01401' AND p.course_code = '02-24-00205';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01401' AND p.course_code = '02-24-00206';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01402' AND p.course_code = '02-24-00201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01403' AND p.course_code = '02-24-00105';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01403' AND p.course_code = '02-24-00106';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01405' AND p.course_code = '02-24-00101';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01405' AND p.course_code = '02-24-00201';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01405' AND p.course_code = '02-24-00205';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01405' AND p.course_code = '02-24-01402';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01406' AND p.course_code = '02-24-00202';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01406' AND p.course_code = '02-24-00204';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01406' AND p.course_code = '02-24-00206';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01407' AND p.course_code = '02-24-00108';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01407' AND p.course_code = '02-24-00206';

-- Computing & Data Sciences Elective Prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01409' AND p.course_code = '02-24-00101';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01409' AND p.course_code = '02-24-00203';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01409' AND p.course_code = '02-24-01201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01410' AND p.course_code = '02-24-00101';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01410' AND p.course_code = '02-24-00108';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01411' AND p.course_code = '02-24-00201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01412' AND p.course_code = '02-24-00201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01413' AND p.course_code = '02-24-00108';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01414' AND p.course_code = '02-24-00108';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01415' AND p.course_code = '02-24-00202';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-01416' AND p.course_code = '02-24-00202';

-- ==============================
-- Business Analytics Program Prerequisites
-- ==============================
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02203' AND p.course_code = '02-24-00202';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02301' AND p.course_code = '02-24-02201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02302' AND p.course_code = '02-24-00102';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02303' AND p.course_code = '02-24-00202';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02304' AND p.course_code = '02-24-00202';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02305' AND p.course_code = '02-24-02301';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02306' AND p.course_code = '02-24-00206';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02401' AND p.course_code = '02-24-00206';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02402' AND p.course_code = '02-24-02201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02403' AND p.course_code = '02-24-00108';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02405' AND p.course_code = '02-24-00206';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02406' AND p.course_code = '02-24-00206';

-- Business Analytics Elective Prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02409' AND p.course_code = '02-24-02203';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02410' AND p.course_code = '02-24-00110';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02412' AND p.course_code = '02-24-00206';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02414' AND p.course_code = '02-24-02402';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02415' AND p.course_code = '02-24-02402';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02416' AND p.course_code = '02-24-00206';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02417' AND p.course_code = '02-24-00206';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02417' AND p.course_code = '02-24-02204';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-02418' AND p.course_code = '02-24-02403';

-- ==============================
-- Intelligent Systems Program Prerequisites
-- ==============================
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03201' AND p.course_code = '02-24-00109';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03202' AND p.course_code = '02-24-00106';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03203' AND p.course_code = '02-24-00101';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03203' AND p.course_code = '02-24-00106';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03204' AND p.course_code = '02-24-00109';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03301' AND p.course_code = '02-24-00109';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03302' AND p.course_code = '02-24-03204';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03303' AND p.course_code = '02-24-00101';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03304' AND p.course_code = '02-24-03303';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03305' AND p.course_code = '02-24-00109';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03306' AND p.course_code = '02-24-00109';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03401' AND p.course_code = '02-24-00109';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03402' AND p.course_code = '02-24-03304';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03403' AND p.course_code = '02-24-00205';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03405' AND p.course_code = '02-24-03202';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03406' AND p.course_code = '02-24-03304';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03407' AND p.course_code = '02-24-03305';

-- Intelligent Systems Elective Prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03409' AND p.course_code = '02-24-00204';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03410' AND p.course_code = '02-24-03403';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03411' AND p.course_code = '02-24-00205';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03411' AND p.course_code = '02-24-03304';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03413' AND p.course_code = '02-24-03402';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03414' AND p.course_code = '02-24-00205';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03415' AND p.course_code = '02-24-04401';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-03416' AND p.course_code = '02-24-03202';

-- ==============================
-- Media Analytics Program Prerequisites
-- ==============================
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04301' AND p.course_code = '02-24-00101';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04301' AND p.course_code = '02-24-00203';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04302' AND p.course_code = '02-24-00101';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04303' AND p.course_code = '02-24-00108';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04304' AND p.course_code = '02-24-00108';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04304' AND p.course_code = '02-24-00203';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04305' AND p.course_code = '02-24-00205';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04306' AND p.course_code = '02-24-04301';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04306' AND p.course_code = '02-24-04303';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04401' AND p.course_code = '02-24-00108';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04401' AND p.course_code = '02-24-04304';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04402' AND p.course_code = '02-24-00108';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04402' AND p.course_code = '02-24-04203';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04405' AND p.course_code = '02-24-00205';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04405' AND p.course_code = '02-24-04302';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04406' AND p.course_code = '02-24-00205';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04406' AND p.course_code = '02-24-04306';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04407' AND p.course_code = '02-24-04403';

-- Media Analytics Elective Prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04411' AND p.course_code = '02-24-04203';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04411' AND p.course_code = '02-24-04301';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04412' AND p.course_code = '02-24-04401';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04413' AND p.course_code = '02-24-00110';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04413' AND p.course_code = '02-24-04401';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-04414' AND p.course_code = '02-24-04401';

-- ==============================
-- Healthcare Informatics Program Prerequisites
-- ==============================
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-05204' AND p.course_code = '02-24-05203';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-05301' AND p.course_code = '02-24-05202';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-05303' AND p.course_code = '02-24-05203';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-05304' AND p.course_code = '02-24-05201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-05305' AND p.course_code = '02-24-05201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-05402' AND p.course_code = '02-24-00201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-05405' AND p.course_code = '02-24-05202';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-05406' AND p.course_code = '02-24-05402';

-- Healthcare Informatics Elective Prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-05410' AND p.course_code = '02-24-05202';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-05411' AND p.course_code = '02-24-05401';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-05411' AND p.course_code = '02-24-05402';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-05412' AND p.course_code = '02-24-05202';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-05413' AND p.course_code = '02-24-05202';

-- ==============================
-- Cybersecurity Program Prerequisites
-- ==============================
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06202' AND p.course_code = '02-24-00101';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06202' AND p.course_code = '02-24-00106';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06203' AND p.course_code = '02-24-06202';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06203' AND p.course_code = '02-24-06201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06302' AND p.course_code = '02-24-00307';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06302' AND p.course_code = '02-24-06201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06303' AND p.course_code = '02-24-00110';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06303' AND p.course_code = '02-24-06201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06304' AND p.course_code = '02-24-00308';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06304' AND p.course_code = '02-24-06203';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06305' AND p.course_code = '02-24-00202';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06305' AND p.course_code = '02-24-06203';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06306' AND p.course_code = '02-24-00202';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06306' AND p.course_code = '02-24-06201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06401' AND p.course_code = '02-24-00308';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06401' AND p.course_code = '02-24-06203';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06402' AND p.course_code = '02-24-00308';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06402' AND p.course_code = '02-24-00307';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06402' AND p.course_code = '02-24-06203';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06403' AND p.course_code = '02-24-06201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06405' AND p.course_code = '02-24-00205';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06405' AND p.course_code = '02-24-00206';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06405' AND p.course_code = '02-24-06306';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06406' AND p.course_code = '02-24-00308';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06406' AND p.course_code = '02-24-00307';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06407' AND p.course_code = '02-24-06201';

-- Cybersecurity Elective Prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06409' AND p.course_code = '02-24-00109';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06410' AND p.course_code = '02-24-00110';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06410' AND p.course_code = '02-24-06201';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06411' AND p.course_code = '02-24-00301';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06411' AND p.course_code = '02-24-06303';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06412' AND p.course_code = '02-24-00202';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06412' AND p.course_code = '02-24-00308';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06413' AND p.course_code = '02-24-00204';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06413' AND p.course_code = '02-24-06203';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06414' AND p.course_code = '02-24-00101';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06414' AND p.course_code = '02-24-00201';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06414' AND p.course_code = '02-24-00205';
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06414' AND p.course_code = '02-24-06401';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06415' AND p.course_code = '02-24-00308';

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-06416' AND p.course_code = '02-24-00308';


-- ==============================
-- 1. Computing & Data Sciences Program (program_id = 1)
-- ==============================

-- Faculty Compulsory Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 1, course_id, 
  CASE 
    WHEN course_code IN ('02-24-00101', '02-24-00102', '02-24-00103', '02-24-00104', '02-24-00105') THEN 1
    WHEN course_code IN ('02-24-00106', '02-24-00107', '02-24-00108', '02-24-00109', '02-24-00110') THEN 2
    WHEN course_code IN ('02-24-00201', '02-24-00202', '02-24-00203') THEN 3
    WHEN course_code IN ('02-24-00204', '02-24-00205', '02-24-00206') THEN 4
  END, NOW()
FROM courses 
WHERE course_code IN ('02-24-00101', '02-24-00102', '02-24-00103', '02-24-00104', '02-24-00105',
                       '02-24-00106', '02-24-00107', '02-24-00108', '02-24-00109', '02-24-00110',
                       '02-24-00201', '02-24-00202', '02-24-00203',
                       '02-24-00204', '02-24-00205', '02-24-00206');

-- Program Compulsory Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 1, course_id, 
  CASE 
    WHEN course_code = '02-24-01201' THEN 3
    WHEN course_code = '02-24-01202' THEN 3
    WHEN course_code = '02-24-01203' THEN 4
    WHEN course_code = '02-24-01204' THEN 4
    WHEN course_code = '02-24-01205' THEN 4  -- Summer after semester 4
    WHEN course_code = '02-24-01301' THEN 5
    WHEN course_code = '02-24-01302' THEN 5
    WHEN course_code = '02-24-01303' THEN 5
    WHEN course_code = '02-24-01304' THEN 6
    WHEN course_code = '02-24-01305' THEN 6
    WHEN course_code = '02-24-01306' THEN 6
    WHEN course_code = '02-24-01307' THEN 6  -- Summer after semester 6
    WHEN course_code = '02-24-01401' THEN 7
    WHEN course_code = '02-24-01402' THEN 7
    WHEN course_code = '02-24-01403' THEN 7
    WHEN course_code = '02-24-01404' THEN 7
    WHEN course_code = '02-24-01405' THEN 8
    WHEN course_code = '02-24-01406' THEN 8
    WHEN course_code = '02-24-01407' THEN 8
    WHEN course_code = '02-24-01408' THEN 8
  END, NOW()
FROM courses 
WHERE course_code IN ('02-24-01201', '02-24-01202', '02-24-01203', '02-24-01204', '02-24-01205',
                       '02-24-01301', '02-24-01302', '02-24-01303', '02-24-01304', '02-24-01305',
                       '02-24-01306', '02-24-01307',
                       '02-24-01401', '02-24-01402', '02-24-01403', '02-24-01404',
                       '02-24-01405', '02-24-01406', '02-24-01407', '02-24-01408');

-- Program Elective Courses (available from semester 5-8)
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 1, course_id, NULL, NOW()
FROM courses 
WHERE course_code IN ('02-24-01409', '02-24-01410', '02-24-01411', '02-24-01412',
                       '02-24-01413', '02-24-01414', '02-24-01415', '02-24-01416');

-- University Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 1, course_id, 
  CASE 
    WHEN course_code = '02-00-00001' THEN 1
    WHEN course_code = '02-00-00002' THEN 2
  END, NOW()
FROM courses 
WHERE course_code IN ('02-00-00001', '02-00-00002');

-- University Electives (available in semesters 3, 4, 6, 7, 8)
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 1, course_id, NULL, NOW()
FROM courses 
WHERE course_type = 'university_elective';

-- Faculty Elective Courses (available from semester 3)
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 1, course_id, NULL, NOW()
FROM courses 
WHERE course_type = 'faculty_elective';

-- ==============================
-- 2. Business Analytics Program (program_id = 2)
-- ==============================

-- Faculty Compulsory Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 2, course_id, 
  CASE 
    WHEN course_code IN ('02-24-00101', '02-24-00102', '02-24-00103', '02-24-00104', '02-24-00105') THEN 1
    WHEN course_code IN ('02-24-00106', '02-24-00107', '02-24-00108', '02-24-00109', '02-24-00110') THEN 2
    WHEN course_code IN ('02-24-00201', '02-24-00202', '02-24-00203') THEN 3
    WHEN course_code IN ('02-24-00204', '02-24-00205', '02-24-00206') THEN 4
  END, NOW()
FROM courses 
WHERE course_code IN ('02-24-00101', '02-24-00102', '02-24-00103', '02-24-00104', '02-24-00105',
                       '02-24-00106', '02-24-00107', '02-24-00108', '02-24-00109', '02-24-00110',
                       '02-24-00201', '02-24-00202', '02-24-00203',
                       '02-24-00204', '02-24-00205', '02-24-00206');

-- Program Compulsory Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 2, course_id, 
  CASE 
    WHEN course_code = '02-24-02201' THEN 3
    WHEN course_code = '02-24-02202' THEN 3
    WHEN course_code = '02-24-02203' THEN 4
    WHEN course_code = '02-24-02204' THEN 4
    WHEN course_code = '02-24-02301' THEN 5
    WHEN course_code = '02-24-02302' THEN 5
    WHEN course_code = '02-24-02303' THEN 5
    WHEN course_code = '02-24-02304' THEN 6
    WHEN course_code = '02-24-02305' THEN 6
    WHEN course_code = '02-24-02306' THEN 6
    WHEN course_code = '02-24-02401' THEN 7
    WHEN course_code = '02-24-02402' THEN 7
    WHEN course_code = '02-24-02403' THEN 7
    WHEN course_code = '02-24-02404' THEN 7
    WHEN course_code = '02-24-02405' THEN 8
    WHEN course_code = '02-24-02406' THEN 8
    WHEN course_code = '02-24-02407' THEN 8
    WHEN course_code = '02-24-02408' THEN 8
  END, NOW()
FROM courses 
WHERE course_code IN ('02-24-02201', '02-24-02202', '02-24-02203', '02-24-02204',
                       '02-24-02301', '02-24-02302', '02-24-02303', '02-24-02304', '02-24-02305', '02-24-02306',
                       '02-24-02401', '02-24-02402', '02-24-02403', '02-24-02404',
                       '02-24-02405', '02-24-02406', '02-24-02407', '02-24-02408');

-- Program Elective Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 2, course_id, NULL, NOW()
FROM courses 
WHERE course_code IN ('02-24-02409', '02-24-02410', '02-24-02411', '02-24-02412', '02-24-02413',
                       '02-24-02414', '02-24-02415', '02-24-02416', '02-24-02417', '02-24-02418');

-- University Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 2, course_id, 
  CASE 
    WHEN course_code = '02-00-00001' THEN 1
    WHEN course_code = '02-00-00002' THEN 2
  END, NOW()
FROM courses 
WHERE course_code IN ('02-00-00001', '02-00-00002');

-- University Electives
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 2, course_id, NULL, NOW()
FROM courses 
WHERE course_type = 'university_elective';

-- Faculty Elective Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 2, course_id, NULL, NOW()
FROM courses 
WHERE course_type = 'faculty_elective';

-- ==============================
-- 3. Intelligent Systems Program (program_id = 3)
-- ==============================

-- Faculty Compulsory Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 3, course_id, 
  CASE 
    WHEN course_code IN ('02-24-00101', '02-24-00102', '02-24-00103', '02-24-00104', '02-24-00105') THEN 1
    WHEN course_code IN ('02-24-00106', '02-24-00107', '02-24-00108', '02-24-00109', '02-24-00110') THEN 2
    WHEN course_code IN ('02-24-00201', '02-24-00202', '02-24-00203') THEN 3
    WHEN course_code IN ('02-24-00204', '02-24-00205', '02-24-00206') THEN 4
  END, NOW()
FROM courses 
WHERE course_code IN ('02-24-00101', '02-24-00102', '02-24-00103', '02-24-00104', '02-24-00105',
                       '02-24-00106', '02-24-00107', '02-24-00108', '02-24-00109', '02-24-00110',
                       '02-24-00201', '02-24-00202', '02-24-00203',
                       '02-24-00204', '02-24-00205', '02-24-00206');

-- Program Compulsory Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 3, course_id, 
  CASE 
    WHEN course_code = '02-24-03201' THEN 3
    WHEN course_code = '02-24-03202' THEN 3
    WHEN course_code = '02-24-03203' THEN 4
    WHEN course_code = '02-24-03204' THEN 4
    WHEN course_code = '02-24-03301' THEN 5
    WHEN course_code = '02-24-03302' THEN 5
    WHEN course_code = '02-24-03303' THEN 5
    WHEN course_code = '02-24-03304' THEN 6
    WHEN course_code = '02-24-03305' THEN 6
    WHEN course_code = '02-24-03306' THEN 6
    WHEN course_code = '02-24-03401' THEN 7
    WHEN course_code = '02-24-03402' THEN 7
    WHEN course_code = '02-24-03403' THEN 7
    WHEN course_code = '02-24-03404' THEN 7
    WHEN course_code = '02-24-03405' THEN 8
    WHEN course_code = '02-24-03406' THEN 8
    WHEN course_code = '02-24-03407' THEN 8
    WHEN course_code = '02-24-03408' THEN 8
  END, NOW()
FROM courses 
WHERE course_code IN ('02-24-03201', '02-24-03202', '02-24-03203', '02-24-03204',
                       '02-24-03301', '02-24-03302', '02-24-03303', '02-24-03304', '02-24-03305', '02-24-03306',
                       '02-24-03401', '02-24-03402', '02-24-03403', '02-24-03404',
                       '02-24-03405', '02-24-03406', '02-24-03407', '02-24-03408');

-- Program Elective Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 3, course_id, NULL, NOW()
FROM courses 
WHERE course_code IN ('02-24-03409', '02-24-03410', '02-24-03411', '02-24-03412',
                       '02-24-03413', '02-24-03414', '02-24-03415', '02-24-03416');

-- University Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 3, course_id, 
  CASE 
    WHEN course_code = '02-00-00001' THEN 1
    WHEN course_code = '02-00-00002' THEN 2
  END, NOW()
FROM courses 
WHERE course_code IN ('02-00-00001', '02-00-00002');

-- University Electives
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 3, course_id, NULL, NOW()
FROM courses 
WHERE course_type = 'university_elective';

-- Faculty Elective Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 3, course_id, NULL, NOW()
FROM courses 
WHERE course_type = 'faculty_elective';

-- ==============================
-- 4. Media Analytics Program (program_id = 4)
-- ==============================

-- Faculty Compulsory Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 4, course_id, 
  CASE 
    WHEN course_code IN ('02-24-00101', '02-24-00102', '02-24-00103', '02-24-00104', '02-24-00105') THEN 1
    WHEN course_code IN ('02-24-00106', '02-24-00107', '02-24-00108', '02-24-00109', '02-24-00110') THEN 2
    WHEN course_code IN ('02-24-00201', '02-24-00202', '02-24-00203') THEN 3
    WHEN course_code IN ('02-24-00204', '02-24-00205', '02-24-00206') THEN 4
  END, NOW()
FROM courses 
WHERE course_code IN ('02-24-00101', '02-24-00102', '02-24-00103', '02-24-00104', '02-24-00105',
                       '02-24-00106', '02-24-00107', '02-24-00108', '02-24-00109', '02-24-00110',
                       '02-24-00201', '02-24-00202', '02-24-00203',
                       '02-24-00204', '02-24-00205', '02-24-00206');

-- Program Compulsory Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 4, course_id, 
  CASE 
    WHEN course_code = '02-24-04201' THEN 3
    WHEN course_code = '02-24-04202' THEN 3
    WHEN course_code = '02-24-04203' THEN 4
    WHEN course_code = '02-24-04204' THEN 4
    WHEN course_code = '02-24-04301' THEN 5
    WHEN course_code = '02-24-04302' THEN 5
    WHEN course_code = '02-24-04303' THEN 5
    WHEN course_code = '02-24-04304' THEN 6
    WHEN course_code = '02-24-04305' THEN 6
    WHEN course_code = '02-24-04306' THEN 6
    WHEN course_code = '02-24-04401' THEN 7
    WHEN course_code = '02-24-04402' THEN 7
    WHEN course_code = '02-24-04403' THEN 7
    WHEN course_code = '02-24-04404' THEN 7
    WHEN course_code = '02-24-04405' THEN 8
    WHEN course_code = '02-24-04406' THEN 8
    WHEN course_code = '02-24-04407' THEN 8
    WHEN course_code = '02-24-04408' THEN 8
  END, NOW()
FROM courses 
WHERE course_code IN ('02-24-04201', '02-24-04202', '02-24-04203', '02-24-04204',
                       '02-24-04301', '02-24-04302', '02-24-04303', '02-24-04304', '02-24-04305', '02-24-04306',
                       '02-24-04401', '02-24-04402', '02-24-04403', '02-24-04404',
                       '02-24-04405', '02-24-04406', '02-24-04407', '02-24-04408');

-- Program Elective Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 4, course_id, NULL, NOW()
FROM courses 
WHERE course_code IN ('02-24-04409', '02-24-04410', '02-24-04411', '02-24-04412',
                       '02-24-04413', '02-24-04414', '02-24-04415');

-- University Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 4, course_id, 
  CASE 
    WHEN course_code = '02-00-00001' THEN 1
    WHEN course_code = '02-00-00002' THEN 2
  END, NOW()
FROM courses 
WHERE course_code IN ('02-00-00001', '02-00-00002');

-- University Electives
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 4, course_id, NULL, NOW()
FROM courses 
WHERE course_type = 'university_elective';

-- Faculty Elective Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 4, course_id, NULL, NOW()
FROM courses 
WHERE course_type = 'faculty_elective';

-- ==============================
-- 5. Healthcare Informatics Program (program_id = 5)
-- ==============================

-- Faculty Compulsory Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 5, course_id, 
  CASE 
    WHEN course_code IN ('02-24-00101', '02-24-00102', '02-24-00103', '02-24-00104', '02-24-00105') THEN 1
    WHEN course_code IN ('02-24-00106', '02-24-00107', '02-24-00108', '02-24-00109', '02-24-00110') THEN 2
    WHEN course_code IN ('02-24-00201', '02-24-00202', '02-24-00203') THEN 3
    WHEN course_code IN ('02-24-00204', '02-24-00205', '02-24-00206') THEN 4
  END, NOW()
FROM courses 
WHERE course_code IN ('02-24-00101', '02-24-00102', '02-24-00103', '02-24-00104', '02-24-00105',
                       '02-24-00106', '02-24-00107', '02-24-00108', '02-24-00109', '02-24-00110',
                       '02-24-00201', '02-24-00202', '02-24-00203',
                       '02-24-00204', '02-24-00205', '02-24-00206');

-- Program Compulsory Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 5, course_id, 
  CASE 
    WHEN course_code = '02-24-05201' THEN 3
    WHEN course_code = '02-24-05202' THEN 3
    WHEN course_code = '02-24-05203' THEN 4
    WHEN course_code = '02-24-05204' THEN 4
    WHEN course_code = '02-24-05205' THEN 4  -- Summer after semester 4
    WHEN course_code = '02-24-05301' THEN 5
    WHEN course_code = '02-24-05302' THEN 5
    WHEN course_code = '02-24-05303' THEN 5
    WHEN course_code = '02-24-05304' THEN 6
    WHEN course_code = '02-24-05305' THEN 6
    WHEN course_code = '02-24-05306' THEN 6
    WHEN course_code = '02-24-05307' THEN 6  -- Summer after semester 6
    WHEN course_code = '02-24-05401' THEN 7
    WHEN course_code = '02-24-05402' THEN 7
    WHEN course_code = '02-24-05403' THEN 7
    WHEN course_code = '02-24-05404' THEN 7
    WHEN course_code = '02-24-05405' THEN 8
    WHEN course_code = '02-24-05406' THEN 8
    WHEN course_code = '02-24-05407' THEN 8
    WHEN course_code = '02-24-05408' THEN 8
  END, NOW()
FROM courses 
WHERE course_code IN ('02-24-05201', '02-24-05202', '02-24-05203', '02-24-05204', '02-24-05205',
                       '02-24-05301', '02-24-05302', '02-24-05303', '02-24-05304', '02-24-05305', '02-24-05306', '02-24-05307',
                       '02-24-05401', '02-24-05402', '02-24-05403', '02-24-05404',
                       '02-24-05405', '02-24-05406', '02-24-05407', '02-24-05408');

-- Program Elective Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 5, course_id, NULL, NOW()
FROM courses 
WHERE course_code IN ('02-24-05409', '02-24-05410', '02-24-05411', '02-24-05412', '02-24-05413');

-- University Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 5, course_id, 
  CASE 
    WHEN course_code = '02-00-00001' THEN 1
    WHEN course_code = '02-00-00002' THEN 2
  END, NOW()
FROM courses 
WHERE course_code IN ('02-00-00001', '02-00-00002');

-- University Electives
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 5, course_id, NULL, NOW()
FROM courses 
WHERE course_type = 'university_elective';

-- Faculty Elective Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 5, course_id, NULL, NOW()
FROM courses 
WHERE course_type = 'faculty_elective';

-- ==============================
-- 6. Cybersecurity Program (program_id = 6)
-- ==============================

-- Faculty Compulsory Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 6, course_id, 
  CASE 
    WHEN course_code IN ('02-24-00101', '02-24-00102', '02-24-00103', '02-24-00104', '02-24-00105') THEN 1
    WHEN course_code IN ('02-24-00106', '02-24-00107', '02-24-00108', '02-24-00109', '02-24-00110') THEN 2
    WHEN course_code IN ('02-24-00201', '02-24-00202', '02-24-00203') THEN 3
    WHEN course_code IN ('02-24-00204', '02-24-00205', '02-24-00206') THEN 4
  END, NOW()
FROM courses 
WHERE course_code IN ('02-24-00101', '02-24-00102', '02-24-00103', '02-24-00104', '02-24-00105',
                       '02-24-00106', '02-24-00107', '02-24-00108', '02-24-00109', '02-24-00110',
                       '02-24-00201', '02-24-00202', '02-24-00203',
                       '02-24-00204', '02-24-00205', '02-24-00206');

-- Program Compulsory Courses (Note: Also uses faculty electives 02-24-00307, 02-24-00308)
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 6, course_id, 
  CASE 
    WHEN course_code = '02-24-06201' THEN 3
    WHEN course_code = '02-24-06202' THEN 3
    WHEN course_code = '02-24-06203' THEN 4
    WHEN course_code = '02-24-00307' THEN 4  -- Operating Systems (Faculty Elective used as compulsory)
    WHEN course_code = '02-24-00308' THEN 5  -- Computer Networks (Faculty Elective used as compulsory)
    WHEN course_code = '02-24-06302' THEN 5
    WHEN course_code = '02-24-06303' THEN 5
    WHEN course_code = '02-24-06304' THEN 6
    WHEN course_code = '02-24-06305' THEN 6
    WHEN course_code = '02-24-06306' THEN 6
    WHEN course_code = '02-24-06401' THEN 7
    WHEN course_code = '02-24-06402' THEN 7
    WHEN course_code = '02-24-06403' THEN 7
    WHEN course_code = '02-24-06404' THEN 7
    WHEN course_code = '02-24-06405' THEN 8
    WHEN course_code = '02-24-06406' THEN 8
    WHEN course_code = '02-24-06407' THEN 8
    WHEN course_code = '02-24-06408' THEN 8
  END, NOW()
FROM courses 
WHERE course_code IN ('02-24-06201', '02-24-06202', '02-24-06203',
                       '02-24-00307', '02-24-00308',
                       '02-24-06302', '02-24-06303', '02-24-06304', '02-24-06305', '02-24-06306',
                       '02-24-06401', '02-24-06402', '02-24-06403', '02-24-06404',
                       '02-24-06405', '02-24-06406', '02-24-06407', '02-24-06408');

-- Program Elective Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 6, course_id, NULL, NOW()
FROM courses 
WHERE course_code IN ('02-24-06409', '02-24-06410', '02-24-06411', '02-24-06412',
                       '02-24-06413', '02-24-06414', '02-24-06415', '02-24-06416');

-- University Courses
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 6, course_id, 
  CASE 
    WHEN course_code = '02-00-00001' THEN 1
    WHEN course_code = '02-00-00002' THEN 2
  END, NOW()
FROM courses 
WHERE course_code IN ('02-00-00001', '02-00-00002');

-- University Electives
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 6, course_id, NULL, NOW()
FROM courses 
WHERE course_type = 'university_elective';

-- Faculty Elective Courses (remaining electives not used as compulsory)
INSERT INTO program_courses (program_id, course_id, semester_offered, created_at)
SELECT 6, course_id, NULL, NOW()
FROM courses 
WHERE course_type = 'faculty_elective'
AND course_code NOT IN ('02-24-00307', '02-24-00308');  -- Already assigned above



-- ==============================
-- 14. INSERT ACADEMIC PROGRAM (Staff assignments)
-- ==============================

INSERT INTO academic_programs (program_id, academic_staff_id, role, assigned_date)
SELECT p.program_id, 'ahmed-abdullah-1975-016', 'coordinator', '2023-09-01'
FROM programs p
WHERE p.program_name_en = 'Intelligent Systems';

INSERT INTO academic_programs (program_id, academic_staff_id, role, assigned_date)
SELECT p.program_id, 'sarah-johnson-1980-017', 'instructor', '2023-09-01'
FROM programs p
WHERE p.program_name_en = 'Computing and Data Sciences';

INSERT INTO academic_programs (program_id, academic_staff_id, role, assigned_date)
SELECT p.program_id, 'mahmoud-elsayed-1972-018', 'instructor', '2023-09-01'
FROM programs p
WHERE p.program_name_en = 'Computing and Data Sciences';

INSERT INTO academic_programs (program_id, academic_staff_id, role, assigned_date)
SELECT p.program_id, 'layla-hassan-1978-019', 'instructor', '2023-09-01'
FROM programs p
WHERE p.program_name_en = 'Computing and Data Sciences';

INSERT INTO academic_programs (program_id, academic_staff_id, role, assigned_date)
SELECT p.program_id, 'karim-mostafa-1982-020', 'instructor', '2023-09-01'
FROM programs p
WHERE p.program_name_en = 'Cybersecurity';

INSERT INTO academic_programs (program_id, academic_staff_id, role, assigned_date)
SELECT p.program_id, 'nadia-ibrahim-1976-021', 'coordinator', '2023-09-01'
FROM programs p
WHERE p.program_name_en = 'Business Analytics';

INSERT INTO academic_programs (program_id, academic_staff_id, role, assigned_date)
SELECT p.program_id, 'tamer-hassan-1979-022', 'instructor', '2023-09-01'
FROM programs p
WHERE p.program_name_en = 'Business Analytics';

INSERT INTO academic_programs (program_id, academic_staff_id, role, assigned_date)
SELECT p.program_id, 'hoda-mahmoud-1981-023', 'coordinator', '2023-09-01'
FROM programs p
WHERE p.program_name_en = 'Intelligent Systems';

INSERT INTO academic_programs (program_id, academic_staff_id, role, assigned_date)
SELECT p.program_id, 'sameh-farouk-1974-024', 'instructor', '2023-09-01'
FROM programs p
WHERE p.program_name_en = 'Business Analytics';
-- ==============================
-- STUDENT COURSES (MATCHING UPDATED SCHEMA)
-- ==============================

-- Note: Using actual course codes from your inserted courses
-- and actual student IDs that match the users table

-- Rahma's completed courses (using actual course codes from your curriculum)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 15, 50, 20, 'B+', 'completed', '2024-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010001'
AND c.course_code = '02-24-00101'
AND asem.semester_code = 'S2024';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 12, 45, 18, 'B', 'completed', '2024-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010001'
AND c.course_code = '02-24-00104'
AND asem.semester_code = 'S2024';

-- Rahma's current enrollments (no grades yet)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010001'
AND c.course_code IN ('02-24-00105', '02-24-00106', '02-24-00107')
AND asem.is_current = TRUE;

-- Ziad's completed courses
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 18, 55, 22, 'A', 'completed', '2022-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010002'
AND c.course_code = '02-24-00101'
AND asem.semester_code = 'F2022';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 16, 52, 21, 'A-', 'completed', '2023-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010002'
AND c.course_code = '02-24-00102'
AND asem.semester_code = 'S2023';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 14, 48, 20, 'B+', 'completed', '2023-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010002'
AND c.course_code = '02-24-00201'
AND asem.semester_code = 'F2023';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 17, 54, 23, 'A', 'completed', '2024-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010002'
AND c.course_code = '02-24-00203'
AND asem.semester_code = 'S2024';

-- Ziad's current enrollments
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010002'
AND c.course_code IN ('02-24-00301', '02-24-00302')
AND asem.is_current = TRUE;

-- Sabah's completed courses
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 18, 56, 24, 'A', 'completed', '2022-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010006'
AND c.course_code = '02-24-00101'
AND asem.semester_code = 'F2022';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 17, 55, 23, 'A', 'completed', '2023-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010006'
AND c.course_code = '02-24-00102'
AND asem.semester_code = 'S2023';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 16, 52, 21, 'A-', 'completed', '2023-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010006'
AND c.course_code = '02-24-00201'
AND asem.semester_code = 'F2023';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 15, 50, 20, 'B+', 'completed', '2024-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010006'
AND c.course_code = '02-24-00203'
AND asem.semester_code = 'S2024';

-- Sabah's current enrollments
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010006'
AND c.course_code IN ('02-24-00301', '02-24-00202')
AND asem.is_current = TRUE;

-- Reem's completed courses (senior student)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 18, 57, 24, 'A', 'completed', '2021-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010004'
AND c.course_code = '02-24-00101'
AND asem.semester_code = 'F2021';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 17, 54, 22, 'A-', 'completed', '2022-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010004'
AND c.course_code = '02-24-00102'
AND asem.semester_code = 'S2022';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 18, 56, 23, 'A', 'completed', '2022-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010004'
AND c.course_code = '02-24-00201'
AND asem.semester_code = 'F2022';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 17, 55, 24, 'A', 'completed', '2023-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010004'
AND c.course_code = '02-24-00301'
AND asem.semester_code = 'S2023';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 16, 53, 21, 'A-', 'completed', '2023-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010004'
AND c.course_code = '02-24-01401'
AND asem.semester_code = 'F2023';

-- Reem's current enrollment
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010004'
AND c.course_code = '02-24-01408'
AND asem.is_current = TRUE;

-- Osama's completed courses
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 10, 40, 15, 'B', 'completed', '2023-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010007'
AND c.course_code = '02-24-00101'
AND asem.semester_code = 'F2023';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 8, 35, 12, 'C+', 'completed', '2024-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010007'
AND c.course_code = '02-24-00102'
AND asem.semester_code = 'S2024';

-- Osama's current enrollments
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010007'
AND c.course_code IN ('02-24-00105', '02-24-00104')
AND asem.is_current = TRUE;

-- ==============================
-- FAILED & RETAKEN COURSES
-- ==============================

-- Osama failed 02-24-00105 in Spring 2024
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 5, 20, 8, 'F', 'failed', '2024-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010007'
AND c.course_code = '02-24-00105'
AND asem.semester_code = 'S2024';


-- Osama failed 02-24-00107 in Fall 2023
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 4, 18, 7, 'F', 'failed', '2023-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010007'
AND c.course_code = '02-24-00107'
AND asem.semester_code = 'Fall Semester 2024';

-- Mariam failed 02-24-00202 in Spring 2024
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 7, 28, 10, 'D', 'failed', '2024-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010010'
AND c.course_code = '02-24-00202'
AND asem.semester_code = 'S2024';

-- Omar failed 02-24-00101 in Fall 2023
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 3, 15, 5, 'F', 'failed', '2023-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010009'
AND c.course_code = '02-24-00101'
AND asem.semester_code = 'F2023';

-- Omar retook 02-24-00101 in Spring 2024 and passed
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 9, 38, 14, 'C', 'completed', '2024-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010009'
AND c.course_code = '02-24-00101'
AND asem.semester_code = 'S2024';

-- Omar failed 02-24-00102 in Fall 2023
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 6, 22, 9, 'D', 'failed', '2023-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010009'
AND c.course_code = '02-24-00102'
AND asem.semester_code = 'F2023';

-- Youssef failed 02-24-00201 in Fall 2023
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 5, 19, 7, 'F', 'failed', '2023-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010011'
AND c.course_code = '02-24-00201'
AND asem.semester_code = 'F2023';


-- Youssef failed 02-24-00203 in Spring 2024
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 6, 22, 8, 'F', 'failed', '2024-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010011'
AND c.course_code = '02-24-00203'
AND asem.semester_code = 'S2024';

-- Fatima failed 02-24-00203 in Spring 2024
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 7, 26, 10, 'D+', 'failed', '2024-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010012'
AND c.course_code = '02-24-00203'
AND asem.semester_code = 'S2024';

-- Fatima retaking 02-24-00203 in current semester
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010012'
AND c.course_code = '02-24-00203'
AND asem.is_current = TRUE;

-- Sabah failed 02-24-00107 in Fall 2022
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 4, 17, 6, 'F', 'failed', '2022-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010006'
AND c.course_code = '02-24-00107'
AND asem.semester_code = 'F2022';

-- Reem failed 02-24-00202 in Spring 2022
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 7, 27, 10, 'D+', 'failed', '2022-05-30', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010004'
AND c.course_code = '02-24-00202'
AND asem.semester_code = 'S2022';

-- Reem retook 02-24-00202 in Fall 2022 and passed
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 17, 56, 23, 'A', 'completed', '2022-12-20', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010004'
AND c.course_code = '02-24-00202'
AND asem.semester_code = 'F2022';

-- Ziad withdrawal from 02-24-00106 in Fall 2023
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 0, 0, 0, 'W', 'withdrawn', '2023-10-15', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010002'
AND c.course_code = '02-24-00106'
AND asem.semester_code = 'F2023';

-- Additional current enrollments for students retaking failed courses
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010009'
AND c.course_code = '02-24-00102'
AND asem.is_current = TRUE;

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010011'
AND c.course_code = '02-24-00203'
AND asem.is_current = TRUE;

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT s.student_id, c.course_id, asem.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM students s, courses c, academic_semesters asem
WHERE s.student_id = '22010010'
AND c.course_code = '02-24-00202'
AND asem.is_current = TRUE;




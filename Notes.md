## Challenges Faced During Project Development

### Technical Challenges

#### 1. PGlite Integration

* **Worker Communication Issues**: Establishing reliable communication between the main thread and the PGlite worker was challenging. Initial implementations led to timeout errors while creating database tables.
* **Module Resolution**: Proper loading and initialization of the worker script in the browser required careful Vite configuration and correct file paths.
* **Query Timeout Handling**: Handling long-running queries necessitated proper timeout mechanisms and error recovery strategies.

#### 2. Offline-First Architecture

* **Data Persistence**: Ensuring reliable storage of patient data in IndexedDB without loss was a primary focus.
* **Schema Initialization**: Initializing the database schema during the first load while handling failures gracefully.
* **Connection State Management**: Implementing a system to monitor and display the current database connection status.

#### 3. React/TypeScript Implementation

* **Type Safety**: Maintaining strong TypeScript typing, particularly for database query results.
* **Component Composition**: Designing reusable and consistent UI components.
* **State Management**: Managing complex states for forms, including validation and asynchronous operations.

#### 4. UI/UX Challenges

* **Consistent Design System**: Developing and maintaining a uniform design system across the app.
* **Dark/Light Mode**: Ensuring reliable theme toggling with Tailwind CSS.
* **Responsive Layouts**: Guaranteeing optimal performance and appearance across mobile, tablet, and desktop devices.
* **Form Validation**: Providing intuitive validation feedback with clear error messages and visual cues.
* **Loading States**: Creating smooth and informative loading states during asynchronous operations.

#### 5. Performance Considerations

* **Query Performance**: Optimizing SQL queries for better performance within the browser.
* **UI Rendering**: Avoiding unnecessary component re-renders.
* **Worker Communication Overhead**: Reducing the cost of communication between the main thread and the worker.

### Development Process Challenges

#### 1. Project Structure

* **File Organization**: Structuring the project for clarity, maintainability, and scalability.
* **Code Reusability**: Abstracting code intelligently without adding unnecessary complexity.

#### 2. Testing and Debugging

* **Worker Debugging**: Debugging worker code was difficult due to limited insight into worker execution.
* **Database State Inspection**: Creating tools to inspect database content during development.

#### 3. Design Decisions

* **Schema Design**: Striking a balance between simplicity and data comprehensiveness.
* **UI Component Granularity**: Finding the right level of component modularity for reuse without compromising readability.
* **Error Handling Strategy**: Establishing a consistent, robust error-handling approach throughout the app.

### Learning Outcomes

Despite the challenges, the project led to several key learning experiences:

* Using WebAssembly-based databases in the browser
* Building robust offline-first web applications
* Implementing effective form validation and user feedback systems
* Creating responsive and accessible UI with Tailwind CSS
* Managing asynchronous state in React effectively
* Leveraging TypeScript for improved safety and maintainability

These experiences contributed to a well-architected final product that ensures a seamless user experience, even in environments with unreliable internet connectivity.

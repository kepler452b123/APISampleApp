import { useState } from 'react';
import PropTypes from 'prop-types';

function DepartmentButton({ userId }) {
    const [departments, setDepartments] = useState([]);

    const fetchDepartments = async () => {
        try {
            const response = await fetch(`users/getDepartment/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching the department data:', error);
        }
    };

    return (
        <div>
            <button onClick={fetchDepartments}>Show Departments</button>
            {departments.length > 0 && (
                <ul>
                    {departments.map((dept, index) => (
                        dept.id !== 0 && (  // Use logical && to conditionally render the list item
                            <li key={index}>{dept.department}</li>
                        )
                    ))}
                </ul>
            )}
        </div>
    );
}  // <-- Closing bracket for the function definition

DepartmentButton.propTypes = {
    userId: PropTypes.number.isRequired,  // Validate that userId is a number and required
};

export default DepartmentButton;

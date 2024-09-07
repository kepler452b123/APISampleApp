import React, { useState, useEffect } from 'react';
import './App.css';
import {
    DataGrid, Column, SearchPanel, Selection, FilterRow, Editing, Button as DxButton
} from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.material.blue.dark.css';

import { Popup } from 'devextreme-react/popup';
import { Form, Item } from 'devextreme-react/form';
import { TextBox } from 'devextreme-react/text-box';



function App() {
    const [users, setUsers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [departmentInput, setDepartmentInput] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const string = "getAllWithDepartment";
                const response = await fetch(`users/${ string }`);
                const userData = await response.json();
                setUsers(userData);
            } catch (error) {
                console.log("Error fetching user data", error);
            }
        };

        fetchUsers();
    }, []);

    // Handler for showing the popup and setting the selected user
    const handleShowDepartmentsClick = (e) => {
        const user = e.row.data;
        setSelectedUser(user); // Set the selected user
        setDepartmentInput(user.department); // Load the user's department into the text field
        setShowPopup(true); // Show popup
    };

    const handleRowUpdate = async (e) => {
        console.log("First Name:", e.data.firstName);
        console.log("Last Name:", e.data.lastName);
        console.log("Email:", e.data.email);
        console.log("Date Joined (raw):", e.data.dateJoined);
        if (e.data.dateJoined instanceof Date) {
            console.log("e.data.dateJoined is a Date object");
        } else {
            console.log("e.data.dateJoined is not a Date object, it's a", typeof e.data.dateJoined);
        }
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: e.data.firstName,
                lastName: e.data.lastName,
                email: e.data.email,
                dateJoined: e.data.dateJoined
            })
        };

        try {
            const response = await fetch(`users/update/${e.data.id}`, requestOptions);

            if (!response.ok) {
                throw new Error( `Failed to update user.Status: ${ response.status }`);
            }

            const result = await response.json();
            console.log('User updated successfully:', result);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // Handle saving and closing the popup
    const handleSave = () => {
        // Update the selected user's departments (this can be sent to the server)
        selectedUser.department = departmentInput;
        setShowPopup(false); // Close popup
    };

    const onSaving = (e) => {
        console.log(e.changes[0]);
    }

    return (
        <div>
            <div style={{ fontSize: '32px' }}>Users</div>
            <DataGrid
                dataSource={users}
                keyExpr="id"
                columnAutoWidth={true}
                showBorders={true}
                onRowUpdated={handleRowUpdate}
                remoteOperations={true}
                repaintChangesOnly={true}
                onSaving={onSaving}>

                <SearchPanel visible={true} />
                <Selection mode="multiple" />
                <FilterRow visible={true} />
                <Editing mode="popup" allowUpdating={true} allowAdding={true} allowDeleting={true} />

                <Column dataField="id" caption="Id" allowEditing={false}></Column>
                <Column dataField="firstName" caption="First Name"></Column>
                <Column dataField="lastName" caption="Last Name"></Column>
                <Column dataField="email" caption="Email"></Column>
                <Column dataField="dateJoined" caption="Date Joined" allowEditing={true}></Column>

                {/* Custom button to show departments */}
                <Column type="buttons" caption="Departments">
                    <DxButton text="Show Departments" onClick={handleShowDepartmentsClick} />
                </Column>

                <Column type="buttons" caption="Actions">
                    <DxButton name="edit"></DxButton>
                    <DxButton name="delete"></DxButton>
                </Column>
            </DataGrid>

            {/* Popup to display the department field */}
            {selectedUser && (
                <Popup
                    visible={showPopup}
                    title={`Edit Departments for ${selectedUser.firstName} ${selectedUser.lastName}`}
            onHiding={() => setShowPopup(false)}
            width={400}
            height={350}
            showCloseButton={true}
                >
            <Form>
                <Item
                    label={{ text: 'Departments' }}
                    editorType="dxTextBox"
                >
                    <TextBox
                        value={departmentInput}
                        onValueChanged={(e) => setDepartmentInput(e.value)}
                    />
                </Item>
                <Item>
                    <button onClick={handleSave} style={{ marginTop: '20px' }}>Save</button>
                </Item>
            </Form>
        </Popup>
    )
}
        </div >
    );
}

export default App;

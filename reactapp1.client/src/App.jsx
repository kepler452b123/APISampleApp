import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
    DataGrid, Column, SearchPanel, Selection, FilterRow, Editing, Button as DxButton, Toolbar
} from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.material.blue.dark.css';

import { Popup } from 'devextreme-react/popup';
import { Form, Item } from 'devextreme-react/form';
import { TextBox } from 'devextreme-react/text-box';



function App() {
    const [users, setUsers] = useState([]);
    const [changes, setChanges] = useState([]);
    const [editRowKey, setEditRowKey] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [departmentInput, setDepartmentInput] = useState('');
    const [firstNameInput, setFirstNameInput] = useState('');
    const [lastNameInput, setLastNameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [dateJoinedInput, setDateJoinedInput] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [canSave, setCanSave] = useState(false);

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

    useEffect(() => {
        if (selectedUser) {
            console.log(selectedUser);
            setFirstNameInput(selectedUser.firstName);
            setLastNameInput(selectedUser.lastName);
            setEmailInput(selectedUser.email);
            setDateJoinedInput(selectedUser.dateJoined);
            setShowForm(true);
        }
    }, [selectedUser]);

    useEffect(() => {
        if (changes.length > 0) {
            console.log(changes);
            setCanSave(true);
        }
        else {
            console.log("Changes has been reset!");
            setCanSave(false);
        }
    }, [changes])

    useEffect(() => {
        if (canSave) {
        console.log("Can Save Permanently!")}
    }, [canSave])

    const handleShowEditFormClick = (e) => {
        const user = { ...e.row.data };
        setSelectedUser(user);
    }

    // Handle saving and closing the popup
    const handleSave = () => {
        // Update the selected user's departments (this can be sent to the server)
        selectedUser.department = departmentInput;
        setShowPopup(false); // Close popup
    };

    const handleFormSave = () => {
        selectedUser.firstName = firstNameInput;
        selectedUser.lastName = lastNameInput;
        selectedUser.email = emailInput;
        selectedUser.dateJoined = dateJoinedInput;
        const updatedUsers = users.map(user =>
            user.id === selectedUser.id ? selectedUser : user
        );
        setUsers(updatedUsers);
        setChanges(changes => [...changes, selectedUser]);
        setShowForm(false);
    }


    const handleSaveAll = () => {
        console.log(changes);
        for (let i = 0; i < changes.length; i++) {
            const user = changes[i];
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    dateJoined: user.dateJoined
                })
            };
            try {
                const response = fetch(`users/update/${user.id}`, requestOptions);

                if (!response.ok) {
                    throw new Error(`Failed to update user.Status: ${response.status}`);
                }

                const result = response.json();
                console.log('User updated successfully:', result);
            } catch (error) {
                console.error('Error updating user:', error);
            }

        }
        setChanges([]);
        
    }

    const onSaving = (e) => {
        console.log(e.changes[0]);
    }

    return (
        <div>
            <div style={{ fontSize: '32px' }}>Users</div>
            {canSave && <DxButton text="Permanent Save" onClick={handleSaveAll} disabled={!canSave} />}
            <DataGrid
                dataSource={users}
                keyExpr="id"
                columnAutoWidth={true}
                showBorders={true}
                remoteOperations={true}
                repaintChangesOnly={true}
                onSaving={onSaving}>

                <Toolbar>
                    {canSave && <Item
                        location="before"
                        widget="dxButton"
                        options={{
                            text: 'Permanent Save',
                            icon: 'save',
                            onClick: handleSaveAll 
                        }}
                    />}
                </Toolbar>

                <SearchPanel visible={true} />
                <Selection mode="multiple" />
                <FilterRow visible={true} />
                <Editing mode="batch" allowUpdating={true} allowAdding={true} allowDeleting={true}
                    changes={changes} editRowKey={editRowKey}/>
                <Editing mode="batch" allowUpdating={true} allowAdding={true} allowDeleting={true} />
                <Column dataField="id" caption="Id" allowEditing={false}></Column>
                <Column dataField="firstName" caption="First Name"></Column>
                <Column dataField="lastName" caption="Last Name"></Column>
                <Column dataField="email" caption="Email"></Column>
                <Column dataField="dateJoined" caption="Date Joined" allowEditing={true}></Column>

                {/* Custom button to show departments */}
                <Column type="buttons" caption="Departments">
                    <DxButton text="Show Departments" onClick={handleShowDepartmentsClick} />
                </Column>

                <Column type="buttons" caption="Edit">
                    <DxButton text="Edit" onClick={handleShowEditFormClick} />
                </Column>

                <Column type="buttons" caption="Actions">
                    <DxButton name="edit"></DxButton>
                    <DxButton name="delete"></DxButton>
                </Column>

            </DataGrid>

            {/* Popup to display the department field */}
            {showPopup && (
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

            )}
            
            {showForm && (
                <Popup
                    visible={showForm}
                    title={`Edit user ${selectedUser.id}`}
                    onHiding={() => setShowForm(false)}
                    width={950}
                    height={600}
                    showCloseButton={true}
                >
                    <Form>
                        <Item
                            label={{ text: 'First Name' }}
                            editorType="dxTextBox">
                            <TextBox
                                value= {firstNameInput}
                                onValueChanged= {(e) => setFirstNameInput(e.value)}/>
                        </Item>
                        <Item
                            label={{ text: 'Last Name' }}
                            editorType="dxTextBox">
                            <TextBox
                                value={lastNameInput}
                                onValueChanged= {(e) => setLastNameInput(e.value)} />
                        </Item>
                        <Item
                            label={{ text: 'Email' }}
                            editorType="dxTextBox">
                            <TextBox
                                value={emailInput}
                                onValueChanged= {(e) => setEmailInput(e.value)} />
                        </Item>
                        <Item
                            label={{ text: 'Date Joined' }}
                            editorType="dxTextBox">
                            <TextBox
                                value={dateJoinedInput}
                                onValueChanged={(e) => setDateJoinedInput(e.value)} />
                        </Item>
                        <Item>
                            <button onClick={handleFormSave} style={{ marginTop: '20px' }}>Save</button>
                        </Item>

                    </Form>

                </Popup>
            ) }
           
        </div >
    );
}

export default App;

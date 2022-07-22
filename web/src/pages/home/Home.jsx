/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Featured from '../../components/featured/Featured';
import List from '../../components/list/List';
import NavBar from '../../components/navbar/NavBar';
import './home.scss';
const Home = ({ type }) =>
{
    const [list, setList] = useState([])
    const [genre, setGenre] = useState('')
    useEffect(() =>
    {

        try {
            getRandomList();
        } catch (error) {
            console.log(error)
        }
    }, [genre, type])

    const getRandomList = async () =>
    {
        const response = await fetch(`api/lists${type ? "?type=" + type : ''}${genre ? "&genre=" + genre : ''}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZDY2NGY0ZDM3MjA1ODNiMmJjZWM1MyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY1ODQ2MjgxNywiZXhwIjoxNjU4ODk0ODE3fQ.2tpfflcn5UrgagA1SO9u2XkyntUs6pxt1ZHde44qozg'
            }
        });
        console.log(response);
    }
    return (
        <>
            <div className="home">
                <NavBar />
                <Featured type={type} />
                <List />
                <List />
                <List />
                <List />
            </div>
        </>
    )
}

export default Home
import styled from 'styled-components'

const Container = styled.div`
    width: 350px;
    height: auto;
    border: 0.5px solid lightgray;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 5px;
`

const TopContainer = styled.div`
    width: 320px;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const SearchContainer = styled.div`
    width: 270px;
    height: 24px;
    background-color: #F1EDEC;
    border-radius: 10px;
    display: flex;
    justify-content: baseline;
    align-items: center;
    padding: 5px;
    border: 1px solid gray;
`

const SearchLabel = styled.label`
    font-size: 20px;
    color: #8A8382;
    cursor: pointer;
    padding-top: 6px; 
`

const SearchInput = styled.input`
    width: 100%;
    border: none;
    height: 20px;
    background-color: #F1EDEC;
    font-size: 16px;
    &:focus {
        outline: none;
    };
`

const SettingIcon = styled.div`
    // font-size: 46px;
    height: 24px;
    line-height: 24px;
    cursor: pointer;
    &:hover {
        color: lightgray;
    }
`

const ActivityContainer = styled.div`
    width: 320px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // border: 1px solid lightgray;
    margin-top: 10px;
` 

const ActivityItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
        color: lightgray;
    }
    &:nth-child(${props =>  {
        switch(props.tab) {
            case 'Peer':
                return '1'
            case 'Group':
                return '2'
            case 'Meeting':
                return '3'
            case 'Contact': 
                return '4'
        }}}) {
        color: var(--mainBlue);
    }
    
    // &:focus {
    //     color: var(--mainBlue);
    // }
`

const TabList = styled.div`
    width: 310px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content: center;
    margin-top: 10px;
    padding: 5px;
    // border: 1px solid lightgray;
`

const TabItem = styled.div`
    // width: 300px;
    width: 340px;
    // height: 44px;
    height: 58px;
    cursor: pointer;
    margin-bottom: 3px;
    border-radius: 7px;
    // font-weight: ${props => props.notify === true && 'bold'};
    &:hover {
        background-color: #EBF5F9;
    }
    &:focus {
        background-color: #B9E7F9;
    }
    &:nth-child(${localStorage.getItem('chatId')}) {
        background-color: #B9E7F9;
    }
`

const NotFound = styled.div`
    line-height: 44px;
    font-size: 24px;
    font-weight: 700;
    color: #3C3434;
    margin-left: 16px;
`

const ChatItem = styled.div`
    display: flex;
    // flex-direction: column;
    justify-content: center;
    margin-left: 16px;
    // border: 1px solid;
`

const ChatAvatar = styled.div`
    position: relative;
`

const ChatTitle = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-item: center;
`

const StatusSign = styled.div`
    position: absolute;
    right: 3px;
    bottom: 5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
`

const OnlineSign = styled(StatusSign)`
    background-color: #19E95F;
`

const OfflineSign = styled(StatusSign)`
    background-color: #D5D8DC;
`

const ChatName = styled.div`
    font-size: 18px;
    font-weight: 500;
`

const Preview = styled.div`
    font-weight: 500;
    // font-weight: ${props => props.notify === true && 'bold'};
    color: ${props => props.notify === true && 'yellow'};
`

export {Container, TopContainer, SearchContainer, SearchLabel, 
    SearchInput, SettingIcon, ActivityContainer, ActivityItem, 
    TabList, TabItem, NotFound, ChatItem, ChatAvatar, ChatTitle, 
    OnlineSign, OfflineSign, ChatName, Preview}
    
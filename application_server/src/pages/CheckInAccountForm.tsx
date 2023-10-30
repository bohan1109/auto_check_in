import CheckInAccountForm from "../components/CheckInAccountForm";
import api from '../Axios.config'
import { snakeCase } from 'lodash';
const CheckInAccountFormPage: React.FC = () => {
    const jwtToken = localStorage.getItem("jwtToken")
    const jwtTokenType = localStorage.getItem("jwtTokenType")
    const config = {
        headers: {
            Authorization: `${jwtTokenType} ${jwtToken}`
        },
    }
    const handleParentSubmit = (formData: { [key: string]: any }) => {
        const toSnakeCase  = Object.keys(formData).reduce((result: Record<string, any>, key) => {
            result[snakeCase(key)] = formData[key];
            return result;
        }, {});
        console.log("toSnakeCase =",JSON.stringify(toSnakeCase , null, 2))
        api.post("/check-in-accounts",toSnakeCase ,config)
        .then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
        })
        console.log("Submitted data:", formData);
    };

    return <CheckInAccountForm initialValues={{ checkInAccount: '', checkInPassword: '',checkInUsername:'' }} onSubmit={handleParentSubmit} title="新增打卡帳號"/>
}

export default CheckInAccountFormPage
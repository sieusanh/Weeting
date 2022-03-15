import { useNavigate } from 'react-router-dom'
import {Container, BlurBackground, Alert, Text, AgreeButton} from './StyledComponent'

function LoginAlert() {
    const navigate = useNavigate()
    return (
        <Container>
            <BlurBackground />
            <Alert>
                <Text>
                    Bạn phải đăng nhập trước khi thực hiện chức năng này!
                </Text>
                <AgreeButton onClick={() => navigate('/login')}>
                    Đồng ý
                </AgreeButton>
            </Alert>
        </Container>
    )
}

export default LoginAlert
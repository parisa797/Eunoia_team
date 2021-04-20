import React from 'react';
import { AuthNavigationProps } from '../components/Navigation';
import { Container, Box, Text, Button, RoundIconButton, RoundIcon } from '../components';

const PasswordChanged = ({ navigation }: AuthNavigationProps<"PasswordChanged">) => {
    const SIZE = 80;

    return(
        <Container pattern={0} footer={
            <Box flexDirection="row" justifyContent="center">
                <RoundIconButton 
                    name="x"
                    size={60}
                    backgroundColor="background" 
                    color="secondary" 
                    onPress={() => navigation.pop()} 
                />
            </Box>
        }>
            <Box alignSelf="center">
                <RoundIcon 
                    name="check"
                    size={SIZE}
                    color="primary"
                    backgroundColor="primaryLight" 
                />
            </Box>
            <Text variant="title1" textAlign="center" marginVertical="l">پسورد حساب شما با موفقیت ذخیره شد</Text>
            <Text variant="body" textAlign="center" marginBottom="l">برای ورود به حساب این پنجره را ببندید.</Text>
            <Box alignItems="center" marginTop="m">
                <Button variant="primary" label="Login again" onPress={() => navigation.navigate('Login')} />
            </Box>
        </Container>
    )
}

export default PasswordChanged;
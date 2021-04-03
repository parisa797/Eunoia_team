import 'react-native';
import React from 'react';
import signup from '../Application/Bshop/signup';
import render from 'react-test-renderer';

test('signup snapShot' ,()=>{
    const component = renderer.create(
        <signup />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
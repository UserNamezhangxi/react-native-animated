/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing
} from 'react-native';

export default class App extends Component<Props> {

    constructor(props) {
        super(props);
        // 设置初始状态
        this.state = {
            translateValue: new Animated.ValueXY({x:0, y:0}), // 二维坐标
            bounceValue: new Animated.Value(0),  //缩放
            rotateValue: new Animated.Value(0),  //旋转
            fadeOutOpacity:new Animated.Value(0) //透明度渐变
        };
    }

    componentDidMount() {
        this.startAnimation();
    }

    render() {
        return (
            <View style={styles.container}>
                <Animated.View style={ //给Animated.View 空间设置style
                    {
                        transform: [  //transform 可执行  scale, scaleX, scaleY, translateX, translateY, rotate, rotateX, rotateY, rotateZ，所以缩放不能放在这个array中
                            {translateY: this.state.translateValue.y}, // 沿着Y轴进行平移
                            {scale: this.state.bounceValue},  //缩放
                            {rotate: this.state.rotateValue.interpolate({ // 旋转，使用插值函数做值映射
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg'],
                                })
                            },
                        ],
                        opacity: this.state.fadeOutOpacity,//透明度渐变
                    }
                }>
                    <Text>Animated</Text>
                </Animated.View>
            </View>
        );
    }

    startAnimation() {
        this.state.bounceValue.setValue(1.5); // 设置一个较大的初始值
        this.state.rotateValue.setValue(0);
        this.state.translateValue.setValue({x: 0,y: 0});
        this.state.fadeOutOpacity.setValue(1);

        Animated.sequence([
            Animated.decay( // 以一个初始速度开始并且逐渐减慢停止。  S=vt-（at^2）/2   v=v - at
                this.state.translateValue,
                {
                    velocity: 1, // 起始速度，必填参数。
                    deceleration: 0.98, // 速度衰减比例，默认为0.997。
                }
            ),
            Animated.delay(1000), // 配合sequence，延迟2秒

            Animated.spring(
                this.state.bounceValue,
                {
                    toValue: 0.8,
                    friction: 1,// 摩擦力，默认为7.
                    tension: 40,// 张力，默认40。
                }
            ),
            Animated.delay(1000), // 配合sequence，延迟2秒

            Animated.timing(
                this.state.rotateValue,
                {
                    toValue: 1,
                    duration: 800,// 动画持续的时间（单位是毫秒），默认为500
                    easing: Easing.out(Easing.quad),// 一个用于定义曲线的渐变函数
                    delay: 0,// 在一段时间之后开始动画（单位是毫秒），默认为0。
                }
            ),
            Animated.delay(1000), // 配合sequence，延迟2秒

            Animated.timing(
                this.state.fadeOutOpacity,
                {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.linear,// 线性的渐变函数
                }
            )
        ]).start(()=>{this.startAnimation()});  //动画无限循环

        // 监听rotateValue值的变化
        this.state.rotateValue.addListener((state) => {
            console.log("rotateValue=>" + state.value);
        });
        this.state.rotateValue.stopAnimation((state) => {
            console.log("stop rotateValue=>" + state.value);
        });

        // ValueXY
        this.state.translateValue.addListener((value) => {
            console.log("translateValue=>x:" + value.x + " y:" + value.y);
        });
        this.state.translateValue.stopAnimation((value) => {
            console.log("stop translateValue=>x:" + value.x + " y:" + value.y);
        });

        //透明度变化
        this.state.fadeOutOpacity.addListener((state) => {
            console.log("fadeOutOpacity=>" + state.value);
        });
        this.state.fadeOutOpacity.stopAnimation((state) => {
            console.log("stop fadeOutOpacity=>" + state.value);
        });
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

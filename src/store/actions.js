import * as allActions from './actionTypes';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

function isImage(filename) {
    return filename.includes("file://") && !filename.match(/file\:\/\/.*\.m4a/) && !filename.match(/file\:\/\/.*\.caf/)
}

function isAudio(filename) {
    return filename.match(/file\:\/\/.*\.m4a/) || filename.match(/file\:\/\/.*\.caf/)
}

export function copyAudioCard(category, flashCard) {
    return (dispatch) => {
        var frontSide = flashCard.frontSide
        var backSide = flashCard.backSide

        if (isAudio(flashCard.frontSide)) {
            var index
            if (flashCard.frontSide.match(/file\:\/\/.*\.m4a/)) {
                index = flashCard.frontSide.match(/\.m4a/).index
            } else {
                index = flashCard.frontSide.match(/\.caf/).index
            }
            frontSide = flashCard.frontSide.slice(0, index) + "_copy" + flashCard.frontSide.slice(index)
            FileSystem.copyAsync({
                from: flashCard.frontSide,
                to: frontSide
            }).then(status => {
                var index
                if (flashCard.backSide.match(/file\:\/\/.*\.m4a/)) {
                    index = flashCard.backSide.match(/\.m4a/).index
                } else {
                    index = flashCard.backSide.match(/\.caf/).index
                }
                backSide = flashCard.backSide.slice(0, index) + "_copy" + flashCard.backSide.slice(index)
                if (isAudio(flashCard.backSide)) {
                    FileSystem.copyAsync({
                        from: flashCard.backSide,
                        to: backSide
                    }).then(status => {
                        flashCard = {
                            frontSide: frontSide,
                            backSide: backSide
                        }
                        dispatch({
                            type: allActions.ADD_FLASHCARD,
                            category: category,
                            data: flashCard
                        });
                    })
                } else {
                    flashCard = {
                        frontSide: frontSide,
                        backSide: backSide
                    }
                    dispatch({
                        type: allActions.ADD_FLASHCARD,
                        category: category,
                        data: flashCard
                    });
                }
            })
        } else if (isAudio(flashCard.backSide)) {
            var index
            if (flashCard.backSide.match(/file\:\/\/.*\.m4a/)) {
                index = flashCard.backSide.match(/\.m4a/).index
            } else {
                index = flashCard.backSide.match(/\.caf/).index
            }
            backSide = flashCard.backSide.slice(0, index) + "_copy" + flashCard.backSide.slice(index)
            FileSystem.copyAsync({
                from: flashCard.backSide,
                to: backSide
            }).then(status => {
                flashCard = {
                    frontSide: frontSide,
                    backSide: backSide
                }
                dispatch({
                    type: allActions.ADD_FLASHCARD,
                    category: category,
                    data: flashCard
                });
                console.log(status)
            })
        } else {
            flashCard = {
                frontSide: frontSide,
                backSide: backSide
            }
            dispatch({
                type: allActions.ADD_FLASHCARD,
                category: category,
                data: flashCard
            });
        }
    }
}

export function addFlashCard(category, flashCard) {
    return (dispatch) => {
        if (isImage(flashCard.frontSide)) {
            ImageManipulator.manipulateAsync(
                flashCard.frontSide,
                [],
                { compress: .2, format: ImageManipulator.SaveFormat.JPEG }
            ).then(frontSideResult => {
                flashCard.frontSide = frontSideResult.uri
                if (isImage(flashCard.backSide)) {
                    ImageManipulator.manipulateAsync(
                        flashCard.backSide,
                        [],
                        { compress: .2, format: ImageManipulator.SaveFormat.JPEG }
                    ).then(backSideResult => {
                        flashCard.backSide = backSideResult.uri
                        dispatch({
                            type: allActions.ADD_FLASHCARD,
                            category: category,
                            data: flashCard
                        });
                    })
                } else {
                    dispatch({
                        type: allActions.ADD_FLASHCARD,
                        category: category,
                        data: flashCard
                    });
                }
            })
        } else if (isImage(flashCard.backSide)) {
            ImageManipulator.manipulateAsync(
                flashCard.backSide,
                [],
                { compress: .2, format: ImageManipulator.SaveFormat.JPEG }
            ).then(backSideResult => {
                flashCard.backSide = backSideResult.uri
                dispatch({
                    type: allActions.ADD_FLASHCARD,
                    category: category,
                    data: flashCard
                });
            })
        }
        else {
            dispatch({
                type: allActions.ADD_FLASHCARD,
                category: category,
                data: flashCard
            });
        }
    };
}

export function updateFlashCard(category, cardIndex, flashCard, side) {
    return (dispatch) => {
        dispatch({
            type: allActions.UPDATE_FLASHCARD,
            category: category,
            index: cardIndex,
            data: flashCard,
            side: side
        });
    };
}

export function deleteFlashCard(category, cardIndex) {
    return (dispatch) => {
        dispatch({
            type: allActions.DELETE_FLASHCARD,
            category: category,
            index: cardIndex
        });
    };
}

export function setCategory(category) {
    return (dispatch) => {
        dispatch({
            type: allActions.SET_CATEGORY,
            data: category
        });
    };
}

export function updateCategory(oldCategory, newCategory) {
    return (dispatch) => {
        dispatch({
            type: allActions.UPDATE_CATEGORY,
            oldCategory: oldCategory,
            newCategory: newCategory
        });
    };
}

export function deleteCategory(category) {
    return (dispatch) => {
        dispatch({
            type: allActions.DELETE_CATEGORY,
            data: category
        });
    };
}

export function updateHighScore(category, quiz, score) {
    return (dispatch) => {
        dispatch({
            type: allActions.UPDATE_HIGH_SCORE,
            category: category,
            quiz: quiz,
            score: score
        });
    };
}

export function updateMtcFrontSideIndex(index) {
    return (dispatch) => {
        dispatch({
            type: allActions.UPDATE_MTC_FRONT_INDEX,
            index: index
        });
    };
}

export function updateMtcBackSideIndex(index) {
    return (dispatch) => {
        dispatch({
            type: allActions.UPDATE_MTC_BACK_INDEX,
            index: index
        });
    };
}

export function updateBackground(background) {
    return (dispatch) => {
        dispatch({
            type: allActions.UPDATE_BACKGROUND,
            background: background
        });
    };
}

export function updateCardColor(frontSideColor, backSideColor) {
    return (dispatch) => {
        dispatch({
            type: allActions.UPDATE_CARD_COLOR,
            frontSideColor: frontSideColor,
            backSideColor: backSideColor
        });
    };
}

export function updateNumCardsPerRow(numCardsPerRow) {
    return (dispatch) => {
        dispatch({
            type: allActions.UPDATE_NUM_CARDS_PER_ROW,
            numCardsPerRow: numCardsPerRow
        });
    };
}
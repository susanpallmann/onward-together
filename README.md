# Onward Together
Onward Together is an experimental create-your-own-adventure story with a multiplayer aspect. It was created as part of an [honors thesis](https://www.susanpallmanndesign.com/files/interaction-design-for-retention.pdf) on using interaction design to improve the viewer's retention of the story.

Check out the live [website](https://susanpallmann.github.io/onward-together/index.html)

## Contents

* [Story](#story)
* [Illustration](#illustration)
* [Animation](#animation)
* [Design](#design)
  * [Typography](#typography)
  * [Progression](#progression)
  * [Art Style](#art-style)
  * [Variable Paths](#variable-paths)
  * [Repetition](#repetition)
  * [Multiplayer](#multiplayer)

## Story
The story itself is not incredibly interesting. This is because if the story were interesting, and users had a positive response to the experience, it would be less clear if this response should be attributed to the experience itself rather than the story. As such, the writing relies on common fantasy tropes and does little to stand out.
## Illustration
The illustration style is based on storyboards and concept art done for films. The loose stroke-based style manages to create a sense of space with minimal detail, allowing the viewer's imagination to fill in the rest. All illustrations and animations were created in Adobe Photoshop.
## Animation
The animation is kept to simple (usually 4-frame) repeating animations to match the vague art style. Although the animation itself is quite minimal, it does make the interaction feel more dynamic, when in reality it is simply pressing buttons.
## Design
There are six primary strategies employed in this website to make the experience more memorable. The story itself is designed to be rather unremarkable. By keeping the subject of the story familiar, any positive reaction from the audience can be attributed to the interaction design rather than the story itself.
### Typography
Some studies have shown that serif typefaces improve retention. Furthermore, fonts that are hard to read (like handwriting) improve memory of the text they display.
### Progression
Text broken into smaller pieces is less daunting to read. This website progressively reveals information by letting the user click on to the next section when they feel ready. 
### Art Style
An art style based on concept art is used to create a mood of mystery and drama. The art is purposely kept vague and abstract to allow the user to fill in the rest with their imagination. 
### Variable Paths
Cognitive offloading is prevented by having 48 possible story paths. The user is more inclined to remember their choices because they may not be able to repeat them next time. 
### Repetition
Information is repeated through story "flashbacks," the game's replayability, and social aspects. In order to find different story outcomes, or compare with others, the user must recall the decisions they made previously. 
### Multiplayer
Although the multiplayer parts are subtle, the presence of another player encourages the user to think about how their actions affect both the story and other people. It also encourages replayability. 
## Development
### Prerequisite: Discount Bootstrap
"Discount Bootstrap" is my lightweight take on Bootstrap's responsive grid system. It has its own repository and documentation over at https://github.com/susanpallmann/discount-bootstrap. It provides most of the website structure through use of classes like:
```css
.container
.row
.column
.span12
.md
```
### Designed for HTML
Most of the planning is done in the document HTML, which allows for the scripts to stay simple and rely on pulling attributes from the clicked elements. Due to this organization, all of the scripting for the entire story is under 300 lines of code. However, the tradeoff is that the HTML has to be organized very carefully.
#### .stage
The entire story is contained in a single HTML document (index.html), and the scripts show or hide specific elements (called "stages").
```html
<div class="container stage stage-3">
```
All stage containers have the class **.stage** as well as an additional class to indicate which stage specifically it is (**.stage-3** in this example).
#### .stage.trigger, [stage], and [path]
Some stages of the story do not provide buttons to progress the story down any particular path. In these situations, the **.stage** element has an additional class, **.trigger**, and some custom attributes to indicate the desired destination. The [stage] attribute lists which stage should be made visible next, and the [path] attribute dictates which information to show in the next stage. Adding these three attributes makes it so that the user can click anywhere in the stage to progress.

```html
<div class="container stage stage-2 trigger" stage="3" path="O">
```

The [path] attribute can have numerous values. In this project, alphabetical values from "A" forward are used to indicate that the desired path is one of several options. However, the value "O" is used when the desired path is the only option available. It is important that in the next stage, there are **.option** elements with a corresponding attribute [path-option] value. Read more about this in the **.option** section.

#### .button.trigger
Similar to our **.stage.trigger** elements, buttons must have the class **.trigger**, and attributes [stage] and [path].
```html
<span class="button trigger" stage="4" path="A" place="2" choice="2">
  I’m lost!
</span>
```
#### var userPath
The user's choices make up a unique path. There are five points in the story at which the path direction is chosen, so paths are referred to as 5-digit numbers. The paths are detailed as follows:

1. **Alone or Together** - This is the initial choice the user makes, stored in the first position of the **userPath** array as either a 1 or a 2. (Alone = 1, Together = 2).

2. **Original or Echo** - This path is determined randomly by the client. The user gets lost in the Echo Cliffs, and is either the first to call out, asking for direction, or the one who answers. This is stored in the second positon of the **userPath** array as either a 1 or a 2. (Original = 1, Echo = 2).

3. **Traveling Cutscene** - This path has three options, meant to represent three possible travel cutscenes as the directions given on the Echo Cliffs if the user chose "Together" for the first option. However, even if the user chose to go "Alone", there are still three possible paths; they just all have the same cutscene. This choice occupies the third position in the **userPAth** array. (Mushroom Forest = 1, Crystal Tunnel = 2, Wisp River = 3).

4. **Help the Monster** - This choice allows the user to either have mercy on a trapped monster or ignore it. This does not change the outcome of the story other than showing a silhouette of the monster on the replay scene (above the tavern). This choice is stored in the fourth position. (Ignore = 1, Help = 2).

5. **Alone or Together** - The user is presented with their original choice again and can either join an adventurer or leave them behind. Choosing to go together causes the "happy" ending. Going alone causes survival, but does not defeat the dragon. This choice is stored in the fifth and final position of the **userPath** array. (Alone = 1, Together = 2).

#### [choice] & [place]
Two additional attributes can be applied to buttons: [choice], which indicates to the script that clicking this button should store a specific choice in the story path, and [place], which indicates which position in the array of choices this new value should occupy.



```html
<span class="option" path-option="B">
```

```html
<span class="server-load-info" req-place="0">
```
```html
<span class="server-random" random-max="3">
```
```html
<span class="server-load random-option" random-option="1">
```

```html
<span class="server-load info-option" server-choice="1">
```

```html
<span class="server-load-info" req-place="0">
```

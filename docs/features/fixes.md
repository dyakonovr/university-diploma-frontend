1. "Все вокрспейсы" - arrow color should be equal with text, now black
2. Command input readonly, while service is working - not disabled
3. Add some gap between sidebar buttons
4. Add global line-height: 1.25
5. From all form remove 
```
<form-container :loading="...">
  <template v-if="!loading"></template>
</form-container>
```
Template with v-if doesn't needed
6. If we have in form select with other entity and pagination, we need to use useSelectInfiniteScroll
7. Why after i send first message in command session, i didn't see session it sidebar? Also will be good, that user can't delete session, if it's actually working
8. Add member, real name of integration in task table. Add filters by: integration, name,  
9. In command session window, after confirm i want to see links to confirmed entities

If something needed, you can write md-report for backend with explanation
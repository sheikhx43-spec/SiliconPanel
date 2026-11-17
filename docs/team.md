---
layout: page

title: The Team
---

<script setup>
  import { VPTeamPage, VPTeamPageTitle, VPTeamPageSection, VPTeamMembers } from "vitepress/theme";
  import { projectManagers } from "./_data/team";
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>SILICON PANEL Team</template>
    <template #lead>
      SILICON PANEL is developed and powered by Silicon Empire Ltd and authored by Md Mainul Hasan.
    </template>
  </VPTeamPageTitle>
  <VPTeamPageSection>
    <template #title>Creator &amp; Organization</template>
    <template #members>
      <VPTeamMembers :members="projectManagers" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
